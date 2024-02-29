import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { refreshVerify, verify } from "@/utils/jwt";

import { UserDB } from "./app/auth/type";
import { connectToDatabase } from "./utils/db";

export const middleware = async (request: NextRequest) => {
  // refreshToken 가져오기
  const refreshToken = cookies().get("refreshToken")?.value || "";
  const verified = await refreshVerify(refreshToken);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  try{
    if(!verified.ok) {
      return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_REDIRECT_URI!));
    }
    else if(request.nextUrl.pathname.startsWith("/admin") && verified.payload.type !== "admin") {
      // return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_REDIRECT_URI!));
    }
  }
  catch {
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_REDIRECT_URI!));
  }

  return NextResponse.next({
    request: {
      ...request,
      headers: requestHeaders,
    },
  });
};

export const config = {
  matcher: "/((?!auth|_next/static|_next/image|favicon.ico|login).*)",
};