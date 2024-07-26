import "moment-timezone";
import moment from "moment";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { collections } from "@/utils/db";
import { defaultUser } from "@/utils/db/utils";
import { accessVerify } from "@/utils/jwt";

const Logout = async (req: NextRequest) => {
  const x_origin = headers().get("x-origin") || "";
  const response = NextResponse.redirect(new URL("/", x_origin), {
    status: 302,
  });
  try {
    const cookie = cookies().get("access_token")?.value || "";
    const very = await accessVerify(cookie);
    const refresh_tokens = await collections.refresh_tokens();
    await refresh_tokens.deleteMany({
      id: very.id,
    });
  }
  catch (e: any) {
    if (e.code !== "ERR_JWS_INVALID") {
      const response = NextResponse.json({
        message: e.message,
      });
      console.error(e.message);
      return response;
    }
  }
  // response.cookies.set({
  //   name: "user",
  //   value: JSON.stringify(defaultUser),
  //   expires: moment().tz("Asia/Seoul").subtract(1, "days").toDate(),
  // });
  response.cookies.set({
    name: "refresh_token",
    value: "",
    expires: moment().tz("Asia/Seoul").subtract(1, "days").toDate(),
    httpOnly: true,
  });
  response.cookies.set({
    name: "access_token",
    value: "",
    expires: moment().tz("Asia/Seoul").subtract(1, "days").toDate(),
    httpOnly: true,
  });
  return response;
};

export default Logout;