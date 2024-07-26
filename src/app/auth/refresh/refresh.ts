import "moment-timezone";
import moment from "moment";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { collections } from "@/utils/db";
import { UserInfo } from "@/utils/db/utils";
import { accessSign, refreshSign, refreshVerify } from "@/utils/jwt";

const refresh = async (req: NextRequest) => {
  const x_origin = headers().get("x-origin") || "";
  const x_url = headers().get("x-url") || "";
  const redirect_to = decodeURIComponent(x_url.split("/auth/refresh?url=")[1]);

  const response = NextResponse.redirect(new URL(redirect_to), {
    status: 302,
  });

  try {
    const refresh_token = cookies().get("refresh_token")?.value || "";
    const very = await refreshVerify(refresh_token);

    const users = await collections.users();
    const refresh_tokens = await collections.refresh_tokens();
    const find_refresh = await refresh_tokens.findOne({
      id: very.id,
      refresh_token: refresh_token,
    });
    if (!find_refresh) {
      return NextResponse.redirect(new URL("/auth/logout", x_origin));
    }

    const user = await users.aggregate<UserInfo>([
      {
        $match: {
          id: very.id,
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    
    ]).toArray();

    const data = user[0];
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

    await refresh_tokens.updateOne({
      id: very.id,
    }, {
      $set: {
        id: data.id,
        refresh_token: refreshToken,
        expires_in: refreshTokenExp.format("YYYY-MM-DD HH:mm:ss"),
      },
    }, {
      upsert: true,
    });
    return response;
  }
  catch (e: any) {
    if (e.code !== "ERR_JWS_INVALID") {
      const response = NextResponse.json({
        message: e.message,
      });
      console.error(e.message);
      return response;
    }
    return NextResponse.redirect(new URL("/auth/logout", x_origin));
  }
};

export default refresh;