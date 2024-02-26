import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verify } from "@/utils/jwt";

export const middleware = async (request: NextRequest) => {
  // refreshToken 가져오기
  const refreshToken = cookies().get("refreshToken")?.value || "";

  // 토큰 검증
  if((await verify(refreshToken)).ok)
    return NextResponse.next();
  else
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_REDIRECT_URI!));
};

export const config = {
  matcher: "/((?!auth|_next/static|_next/image|favicon.ico|login).*)",
};