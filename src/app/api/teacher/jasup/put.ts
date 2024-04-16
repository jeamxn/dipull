import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

const PUT = async (
  req: Request,
) => {
  // 헤더 설정
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
  
  // Authorization 헤더 확인
  const authorization = headers().get("authorization");
  const verified = await verify(authorization?.split(" ")[1] || "");
  if(!verified.ok || !verified.payload?.id) return new NextResponse(JSON.stringify({
    message: "로그인이 필요합니다.",
  }), {
    status: 401,
    headers: new_headers
  });

  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const selectMember = await userCollection.findOne({ id: verified.payload.data.id }) as unknown as UserDB;
  if(selectMember.type !== "teacher") return new NextResponse(JSON.stringify({
    message: "교사만 접근 가능합니다.",
  }), {
    status: 403,
    headers: new_headers
  });

  const { id }: {
    id: string;
  } = await req.json();
  if(!id) return new NextResponse(JSON.stringify({
    message: "학생을 선택 해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  const jasupAdminCollection = client.db().collection("jasup_admin");
  const putUser = await jasupAdminCollection.updateOne({ id }, {
    $set: { id }
  }, {
    upsert: true
  });

  if(putUser.upsertedCount) return new NextResponse(JSON.stringify({
    message: "자습 도우미로 지정되었습니다.",
  }), {
    status: 200,
    headers: new_headers
  });
  else if(putUser.matchedCount) return new NextResponse(JSON.stringify({
    message: "이미 자습 도우미로 지정되어 있습니다.",
  }), {
    status: 400,
    headers: new_headers
  });
  else return new NextResponse(JSON.stringify({
    message: "자습 도우미로 지정하는데 실패했습니다.",
  }), {
    status: 400,
    headers: new_headers
  });
};

export default PUT;