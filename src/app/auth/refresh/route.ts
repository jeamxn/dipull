import { serialize } from "cookie";
import moment from "moment";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import "moment-timezone";

import { connectToDatabase } from "@/utils/db";
import { refresh, sign, verify } from "@/utils/jwt";

import type { DB_userData, TokenInfo } from "../type";

export const GET = async (req: Request) => {
  // 쿠키 확인
  const refreshToken = cookies().get("refreshToken")?.value || "";

  // 헤더 설정
  const headers = new Headers();
  headers.append("Content-Type", "application/json; charset=utf-8");
  
  // 로그인 확인
  if(!refreshToken || !(await verify(refreshToken)).ok) {
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
  const user = (await userCollection.findOne(query) || {}) as DB_userData;
  const userId = user?.id;

  // 새 accessToken 발급
  const accessTokenValue: TokenInfo = {
    id: user.id,
    data: {
      id: user.id,
      profile_image: user.profile_image,
      gender: user.gender,
      name: user.name,
      number: user.number,
    }
  };
  const newAccessToken = await sign(accessTokenValue);

  // refreshToken 갱신
  const newRefreshToken = await refresh(userId);
  await userCollection.updateOne(query, {
    $set: {
      refreshToken: newRefreshToken,
    },
  });

  // 쿠키 설정
  const refreshTokenCookie = serialize("refreshToken", newRefreshToken, {
    path: "/",
    expires: moment().tz("Asia/Seoul").add(30, "days").toDate(),
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