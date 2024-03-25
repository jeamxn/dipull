import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { UserData } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

const GET = async (
  req: Request
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
  const jokeCollection = client.db().collection("joke");
  const data = await jokeCollection.find({
    id: verified.payload.id,
  }).toArray();
  return new NextResponse(JSON.stringify({
    success: true,
    isJoking: !!data.length,
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;