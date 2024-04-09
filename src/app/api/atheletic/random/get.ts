import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

const GET = async (
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
  const atheleticAdminCollection = client.db().collection("atheletic_admin");
  const allAdmin = (await atheleticAdminCollection.find({}).toArray()).map((admin: any) => admin.id);
  if(!allAdmin.includes(verified.payload.id)) return new NextResponse(JSON.stringify({
    message: "권한이 없습니다.",
  }), {
    status: 403,
    headers: new_headers
  });

  const usersCollection = client.db().collection("users");
  const data = await usersCollection.find({}).toArray();
  const length = data.length;
  const random = Math.floor(Math.random() * length);
  const random_user = data[random];
  const {
    id,
    number,
    name,
    gender,
    type,
  } = random_user;

  return new NextResponse(JSON.stringify({
    ok: true,
    data: {
      id,
      number,
      name,
      gender,
      type,
    },
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;