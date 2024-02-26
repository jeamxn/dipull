import { serialize } from "cookie";
import moment from "moment";
import type { NextApiRequest } from "next";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { refresh, sign } from "@/utils/jwt";

export const GET = async (req: NextApiRequest) => {
  // 쿠키 확인
  const refreshToken = cookies().get("refreshToken")?.value || "";

  // 헤더 설정
  const headers = new Headers();
  headers.append("Content-Type", "application/json; charset=utf-8");
  
  // 로그인 확인
  if(!refreshToken) {
    return new Response(JSON.stringify({
      message: "로그인이 필요합니다.",
    }), {
      status: 401,
      headers: headers
    });
  }

  // DB 접속
  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");

  // 유저 확인
  const query = { refreshToken };
  const user = await userCollection.findOne(query);
  const userId = user?.id;

  // 새 accessToken 발급
  const newAccessToken = await sign(userId);

  // refreshToken 갱신
  const newRefreshToken = await refresh(userId);
  await userCollection.updateOne(query, {
    $set: {
      refreshToken: newRefreshToken,
    },
  });

  // 쿠키 설정
  const accessTokenCookie = serialize("accessToken", newAccessToken, {
    path: "/",
    expires: moment().add(10, "minute").toDate(),
    httpOnly: true,
  });
  headers.append("Set-Cookie", accessTokenCookie);

  const refreshTokenCookie = serialize("refreshToken", newRefreshToken, {
    path: "/",
    expires: moment().add(30, "days").toDate(),
    httpOnly: true,
  });
  headers.append("Set-Cookie", refreshTokenCookie);

  // 응답
  return new NextResponse(JSON.stringify({
    message: "토큰이 갱신되었습니다.",
    accessToken: newAccessToken
  }), {
    status: 200,
    headers: headers
  });
};