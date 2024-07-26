import "moment-timezone";
import axios from "axios";
import * as jose from "jose";
import moment from "moment";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { collections } from "@/utils/db";
import { UserInfo } from "@/utils/db/utils";
import { accessSign, refreshSign } from "@/utils/jwt";

export const GET = async (req: NextRequest) => {
  try {
    const x_origin = headers().get("x-origin") || "";
    const response = NextResponse.redirect(new URL("/", x_origin), {
      status: 302,
    });

    const { searchParams } = new URL(req.url!);
    const token = searchParams.get("token") || "";
    const public_key = await axios.get(`${process.env.NEXT_PUBLIC_DIMIGOIN_URI}/oauth/public`);
    const public_key_encodes = await jose.importSPKI(public_key.data, "RS256");
    const decodedToken = await jose.jwtVerify<{
      data: UserInfo;
    }>(token, public_key_encodes);

    const data = decodedToken.payload.data;
    const refreshTokenExp = moment().tz("Asia/Seoul").add(30, "days");
    // response.cookies.set({
    //   name: "user",
    //   value: JSON.stringify(data),
    //   expires: refreshTokenExp.toDate(),
    // });

    const refreshToken = await refreshSign(data);
    response.cookies.set({
      name: "refresh_token",
      value: refreshToken,
      expires: refreshTokenExp.toDate(),
      httpOnly: true,
    });

    const accessToken = await accessSign(data);
    response.cookies.set({
      name: "access_token",
      value: accessToken,
      expires: moment().tz("Asia/Seoul").add(1, "days").toDate(),
      httpOnly: true,
    });

    const users = await collections.users();
    const refresh_tokens = await collections.refresh_tokens();

    const updates = [
      users.updateOne({
        id: data.id,
      }, {
        $set: {
          ...data,
        }
      }, {
        upsert: true,
      }),
      refresh_tokens.updateOne({
        id: data.id,
      }, {
        $set: {
          id: data.id,
          refresh_token: refreshToken,
          expires_in: refreshTokenExp.format("YYYY-MM-DD HH:mm:ss"),
        }
      }, {
        upsert: true,
      })
    ];
    await Promise.all(updates);
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json({
      message: e.message,
    });
    console.error(e.message);
    return response;
  }
  
};