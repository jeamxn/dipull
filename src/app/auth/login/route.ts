import axios from "axios";
import { serialize } from "cookie";
import * as jose from "jose";
import moment from "moment";
import { NextResponse } from "next/server";
import "moment-timezone";

import { connectToDatabase } from "@/utils/db";
import { refresh, refreshVerify, sign } from "@/utils/jwt";

import type { DB_userData, TokenInfo, UserData } from "../type";

import { ClientType } from "./type";

export const GET = async (req: Request) => {
  // 디풀에서 받은 토큰 가져오기
  const { searchParams } = new URL(req.url!);
  const token = searchParams.get("token") || "";

  // 디풀 퍼블릭 키 가져오기
  const public_key = await axios.get(`${process.env.NEXT_PUBLIC_DIMIGOIN_URI}/oauth/public`);
  const public_key_encodes = await jose.importSPKI(public_key.data, "RS256");

  // 디풀 토큰 디코딩
  const decodedToken = await jose.jwtVerify(token, public_key_encodes);
  const data = decodedToken.payload as {
    data: UserData;
    iss: string;
    aud: string;
    iat: number;
    exp: number;
  };

  // refresh, access 토큰 발급
  const refreshData: UserData = {
    id: data.data.id,
    type: data.data.type,
    profile_image: data.data.profile_image,
    gender: data.data.gender,
    name: data.data.name,
    number: Number(data.data.number),
  };

  const refreshToken = await refresh(refreshData);

  const update_data: DB_userData = {
    ...refreshData,
    refreshToken,
  };

  const accessTokenValue: TokenInfo = {
    id: update_data.id,
    data: {
      id: update_data.id,
      type: data.data.type,
      profile_image: update_data.profile_image,
      gender: update_data.gender,
      name: update_data.name,
      number: update_data.number,
    }
  };

  const accessToken = await sign(accessTokenValue);
    
  // DB 업데이트
  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const query = { id: data.data.id };
  const update = {
    $set: update_data,
  };
  const options = { upsert: true };
  await userCollection.updateOne(query, update, options);

  // 쿠키 설정
  const refreshTokenCookie = serialize("refreshToken", refreshToken, {
    path: "/",
    expires: moment().tz("Asia/Seoul").add(30, "days").toDate(),
    httpOnly: true,
  });
  const accessTokenCookie = serialize("accessToken", accessToken, {
    path: "/",
    expires: moment().tz("Asia/Seoul").add(1, "days").toDate(),
    // httpOnly: true,
  });

  // 헤더 설정
  const headers = new Headers();
  headers.append("Content-Type", "application/json; charset=utf-8");
  headers.append("Set-Cookie", refreshTokenCookie);
  headers.append("Set-Cookie", accessTokenCookie);

  // 응답
  return new NextResponse(JSON.stringify({
    message: "로그인 성공.",
    accessToken: accessToken
  }), {
    status: 200,
    headers: headers
  });
};