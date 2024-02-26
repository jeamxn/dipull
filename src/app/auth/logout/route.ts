import { serialize } from "cookie";
import moment from "moment";
import type { NextApiRequest } from "next";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

export const GET = async (req: NextApiRequest) => {
  // 헤더 설정
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
    
  // Authorization 헤더 확인
  const authorization = headers().get("authorization");
  const verified = await verify(authorization?.split(" ")[1] || "");
  if(!verified.ok) return new NextResponse(JSON.stringify({
    message: "로그인이 필요합니다.",
  }), {
    status: 401,
    headers: new_headers
  });
  
  // DB 업데이트
  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const query = { id: verified.userId };
  await userCollection.updateOne(query, {
    $set: {
      refreshToken: "",
    }
  });

  // 쿠키 설정
  const refreshTokenCookie = serialize("refreshToken", "", {
    path: "/",
    expires: moment().subtract(1, "days").toDate(),
    httpOnly: true,
  });
  new_headers.append("Set-Cookie", refreshTokenCookie);
  
  // 응답
  return new NextResponse(JSON.stringify({
    message: "로그아웃 되었습니다.",
  }), {
    status: 200,
    headers: new_headers
  });
};