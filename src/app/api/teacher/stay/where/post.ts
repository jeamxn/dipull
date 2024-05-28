import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

const POST = async (
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

  const { grade1, grade2, grade3 } = await req.json();
  if(grade1 === undefined || grade2 === undefined || grade3 === undefined) return new NextResponse(JSON.stringify({
    message: "학년을 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  const statesCollection = client.db().collection("states");
  const update = await statesCollection.updateOne({ type: "class_stay" }, {
    $set: {
      data: {
        1: grade1,
        2: grade2,
        3: grade3,
      }
    }
  });
  
  if (update.matchedCount === 0) {
    return new NextResponse(JSON.stringify({
      message: "잔류 장소 설정에 실패했습니다.",
    }), {
      status: 500,
      headers: new_headers
    });
  }
  return new NextResponse(JSON.stringify({
    success: true,
    message: "잔류 장소 설정에 성공했습니다.",
  }), {
    status: 200,
    headers: new_headers
  });
};

export default POST;