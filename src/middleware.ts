import "moment-timezone";
import moment from "moment";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { defaultUser, UserInfo } from "./utils/db/utils";

export const middleware = async (request: Readonly<NextRequest>) => {
  const origin = request.nextUrl.origin;
  // const refreshToken = cookies().get("refreshToken")?.value || "";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);
  requestHeaders.set("x-origin", origin);

  const response = NextResponse.next({
    request: {
      ...request,
      headers: requestHeaders,
    },
  });

  const userdata = request.cookies.get("user");
  if (!userdata?.value) {
    const refreshTokenExp = moment().tz("Asia/Seoul").add(30, "days");
    response.cookies.set({
      name: "user",
      value: JSON.stringify(defaultUser),
      expires: refreshTokenExp.toDate(),
    });
  }

  try{
    const userAgent = requestHeaders.get("user-agent");
    if(userAgent?.includes("KAKAOTALK")){
      return NextResponse.redirect(`kakaotalk://web/openExternal?url=${encodeURIComponent(request.url)}`);
    }
  }
  catch {
    return NextResponse.redirect(new URL("/login", origin));
  }
  return response;
};

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico|public|cron|manifest.json).*)",
};