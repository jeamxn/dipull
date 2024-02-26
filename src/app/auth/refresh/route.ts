import { serialize } from "cookie";
import moment from "moment";
import type { NextApiRequest } from "next";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { refresh, refreshVerify, sign } from "@/utils/jwt";
export const GET = async (req: NextApiRequest) => {
  const refreshToken = ( cookies().get("refreshToken")?.value || "" ) as string;

  const headers = new Headers();
  headers.append("Content-Type", "application/json; charset=utf-8");
  console.log("1");
  if(!refreshToken) {
    console.log("1-1");
    return new Response(JSON.stringify({
      message: "로그인이 필요합니다.",
    }), {
      status: 401,
      headers: headers
    });
  }
  console.log("2");


  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const query = { refreshToken };
  const user = await userCollection.findOne(query);
  const userId = user?.id;
  const newAccessToken = await sign(userId);
  console.log("3");

  const accessTokenCookie = serialize("accessToken", newAccessToken, {
    path: "/",
    expires: moment().add(10, "minute").toDate(),
    httpOnly: true,
  });
  headers.append("Set-Cookie", accessTokenCookie);
  console.log("4");

  if(!refreshVerify(refreshToken)) {
    console.log("5");
    
    const newRefreshToken = await refresh(userId);
    await userCollection.updateOne(query, {
      $set: {
        refreshToken: newRefreshToken,
      },
    });
    const refreshTokenCookie = serialize("refreshToken", newRefreshToken, {
      path: "/",
      expires: moment().add(30, "days").toDate(),
      httpOnly: true,
    });
    
    headers.append("Set-Cookie", refreshTokenCookie);
    console.log("6");

  }
  console.log("7");

  return new NextResponse(JSON.stringify({
    message: "토큰이 갱신되었습니다.",
    accessToken: newAccessToken
  }), {
    status: 200,
    headers: headers
  });
};