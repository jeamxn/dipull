import "moment-timezone";
import moment from "moment";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { defaultUser } from "./utils/db/utils";
import { accessVerify, refreshVerify } from "./utils/jwt";

export const middleware = async (request: Readonly<NextRequest>) => {
  const origin = request.nextUrl.origin;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);
  requestHeaders.set("x-origin", origin);

  console.log(request.nextUrl.search);

  const response = NextResponse.next({
    request: {
      ...request,
      headers: requestHeaders,
    },
  });

  // const userdata = request.cookies.get("user");
  // if (!userdata?.value) {
  //   const refreshTokenExp = moment().tz("Asia/Seoul").add(30, "days");
  //   response.cookies.set({
  //     name: "user",
  //     value: JSON.stringify(defaultUser),
  //     expires: refreshTokenExp.toDate(),
  //   });
  // }

  try{
    const userAgent = requestHeaders.get("user-agent");
    if(userAgent?.includes("KAKAOTALK")){
      return NextResponse.redirect(`kakaotalk://web/openExternal?url=${encodeURIComponent(request.url)}`);
    }

    const isKey = request.url.includes("/key");
    const search = request.nextUrl.searchParams.get("key");
    if (isKey && search !== process.env.TEACHERS_CODE) {
      return NextResponse.redirect(new URL("/", origin));
    }

    const isGrant = request.url.includes("/grant");
    const isStudent = request.url.includes("/student");
    const isTeacher = request.url.includes("/teacher");
    if (isGrant || isStudent || isTeacher) {
      try {
        const refreshToken = request.cookies.get("refresh_token")?.value || "";
        const refresh = await refreshVerify(refreshToken);

        if (refresh.type !== "student" && isStudent) {
          return NextResponse.redirect(new URL("/", origin));
        }
        if (refresh.type !== "teacher" && isTeacher) {
          return NextResponse.redirect(new URL("/", origin));
        }
      }
      catch {
        return NextResponse.redirect(new URL("/auth/logout", origin));
      }
      const accessToken = request.cookies.get("access_token")?.value || "";
      await accessVerify(accessToken);
    }
  }
  catch {
    return NextResponse.redirect(new URL(`/auth/refresh?url=${request.url}`, origin));
  }
  return response;
};

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico|public|cron|manifest.json).*)",
};