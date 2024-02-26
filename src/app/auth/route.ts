import axios from "axios";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import moment from "moment";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { refresh, sign } from "@/utils/jwt";

export const GET = async (req: NextApiRequest) => {
  const { searchParams } = new URL(req.url!);
  const token = searchParams.get("token") || "";
  const public_key = await axios.get(`${process.env.NEXT_PUBLIC_DIMIGOIN_URI}/auth/public`);

  const decodedToken = jwt.verify(token, public_key.data);
  const data = decodedToken as {
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

  const refreshToken = await refresh(data.data.openId);
  const accessToken = await sign(data.data.openId);
  console.log("1");
    
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
  const result = await userCollection.updateOne(query, update, options);
  console.log(result);
  const user = await userCollection.findOne(query);
  console.log("2");

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

  const headers = new Headers();
  headers.append("Content-Type", "application/json; charset=utf-8");
  headers.append("Set-Cookie", accessTokenCookie);
  headers.append("Set-Cookie", refreshTokenCookie);

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_REDIRECT_URI!), {
    status: 302,
    headers: headers
  });
};