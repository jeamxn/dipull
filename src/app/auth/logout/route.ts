import { serialize } from "cookie";
import moment from "moment";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export const GET = async (req: NextApiRequest) => {
  // 쿠키에서 토큰 가져오기
  const { accessToken, refreshToken } = req.cookies as {
    accessToken: string;
    refreshToken: string;
  };

  // 쿠키 설정
  const accessTokenCookie = serialize("accessToken", accessToken, {
    path: "/",
    expires: moment().subtract(1, "days").toDate(),
    httpOnly: true,
  });
  const refreshTokenCookie = serialize("refreshToken", refreshToken, {
    path: "/",
    expires: moment().subtract(1, "days").toDate(),
    httpOnly: true,
  });

  // 헤더 설정
  const headers = new Headers();
  headers.append("Content-Type", "application/json; charset=utf-8");
  headers.append("Set-Cookie", accessTokenCookie);
  headers.append("Set-Cookie", refreshTokenCookie);
  
  // 응답
  return new NextResponse(JSON.stringify({
    message: "로그아웃 되었습니다.",
  }), {
    status: 200,
    headers: headers
  });
};