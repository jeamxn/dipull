import axios from "axios";
import { serialize } from "cookie";
import * as jose from "jose";
import moment from "moment";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { refresh, sign } from "@/utils/jwt";

export const GET = async (req: NextApiRequest) => {
  // 디미고인에서 받은 토큰 가져오기
  const { searchParams } = new URL(req.url!);
  const token = searchParams.get("token") || "";

  // 디미고인 퍼블릭 키 가져오기
  const public_key = await axios.get(`${process.env.NEXT_PUBLIC_DIMIGOIN_URI}/auth/public`);
  const public_key_encodes = await jose.importSPKI(public_key.data, "RS256");

  // 디미고인 토큰 디코딩
  const decodedToken = await jose.jwtVerify(token, public_key_encodes);
  const data = decodedToken.payload as {
    data: {
      type: string;
      openId: string;
      name: string;
      gender: string;
      studentId: {
        grade: number;
        class: number;
        number: number;
      }
    },
    iss: string;
    aud: string;
    iat: number;
    exp: number;
  };

  // refresh, access 토큰 발급
  const refreshToken = await refresh(data.data.openId);
  const accessToken = await sign(data.data.openId);
    
  // DB 업데이트
  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const query = { id: data.data.openId };
  const update_data = {
    id: data.data.openId,
    nickname: data.data.name,
    profile_image: "http://k.kakaocdn.net/dn/1G9kp/btsAot8liOn/8CWudi3uy07rvFNUkk3ER0/img_640x640.jpg",
    thumbnail_image: "http://k.kakaocdn.net/dn/1G9kp/btsAot8liOn/8CWudi3uy07rvFNUkk3ER0/img_640x640.jpg",
    gender: data.data.gender,
    name: data.data.name,
    number: data.data.studentId.grade * 1000 + data.data.studentId.class * 100 + data.data.studentId.number,
    refreshToken,
  };
  const update = {
    $set: update_data,
  };
  const options = { upsert: true };
  await userCollection.updateOne(query, update, options);

  // 쿠키 설정
  const accessTokenCookie = serialize("accessToken", accessToken, {
    path: "/",
    expires: moment().add(10, "minute").toDate(),
    httpOnly: true,
  });
  const refreshTokenCookie = serialize("refreshToken", refreshToken, {
    path: "/",
    expires: moment().add(30, "days").toDate(),
    httpOnly: true,
  });

  // 헤더 설정
  const headers = new Headers();
  headers.append("Content-Type", "application/json; charset=utf-8");
  headers.append("Set-Cookie", accessTokenCookie);
  headers.append("Set-Cookie", refreshTokenCookie);

  // 응답
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_REDIRECT_URI!), {
    status: 302,
    headers: headers
  });
};