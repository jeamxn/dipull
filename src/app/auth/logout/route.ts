import { serialize } from "cookie";
import moment from "moment";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export const GET = async (req: NextApiRequest) => {
  const { accessToken, refreshToken } = req.cookies as {
    accessToken: string;
    refreshToken: string;
  };

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

  const headers = new Headers();
  headers.append("Content-Type", "application/json; charset=utf-8");
  headers.append("Set-Cookie", accessTokenCookie);
  headers.append("Set-Cookie", refreshTokenCookie);
  
  return new NextResponse(JSON.stringify({
    message: "로그아웃 되었습니다.",
  }), {
    status: 200,
    headers: headers
  });
};