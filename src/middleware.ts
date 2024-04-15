import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { refreshVerify, verify } from "@/utils/jwt";

export const middleware = async (request: NextRequest) => {
  const defaultUrl = process.env.NEXT_PUBLIC_APP_URI || "";
  const refreshToken = cookies().get("refreshToken")?.value || "";
  const verified = await refreshVerify(refreshToken);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);
  try{
    if(!request.nextUrl.pathname.startsWith("/login")){
      if(!verified.ok) {
        return NextResponse.redirect(new URL("/login", defaultUrl));
      }
      else if(request.nextUrl.pathname.startsWith("/teacher") && verified.payload.type !== "teacher") {
        return NextResponse.redirect(new URL("/", defaultUrl));
      }
    }
    else if(verified.ok) {
      return NextResponse.redirect(new URL("/", defaultUrl));
    }
  }
  catch {
    return NextResponse.redirect(new URL("/login", defaultUrl));
  }
  return NextResponse.next({
    request: {
      ...request,
      headers: requestHeaders,
    },
  });
};

export const config = {
  matcher: "/((?!auth|_next/static|_next/image|favicon.ico|public|manifest.json).*)",
};