import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { refreshVerify } from "@/utils/jwt";

export const middleware = async (request: NextRequest) => {
  const origin = request.nextUrl.origin;
  const refreshToken = cookies().get("refreshToken")?.value || "";
  const verified = await refreshVerify(refreshToken);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);
  requestHeaders.set("x-origin", origin);

  try{
    const userAgent = requestHeaders.get("user-agent");
    if(userAgent?.includes("KAKAOTALK")){
      return NextResponse.redirect(`kakaotalk://web/openExternal?url=${encodeURIComponent(request.url)}`);
    }
    
    if(!request.nextUrl.pathname.startsWith("/login")){
      if(!verified.ok) {
        return NextResponse.redirect(new URL("/login", origin));
      }
      else if(request.nextUrl.pathname.startsWith("/teacher") && verified.payload.type !== "teacher") {
        return NextResponse.redirect(new URL("/", origin));
      }
      else if(request.nextUrl.pathname.startsWith("/bamboo") && verified.payload.type !== "student") {
        return NextResponse.redirect(new URL("/", origin));
      }
    }
    else if(verified.ok) {
      return NextResponse.redirect(new URL("/", origin));
    }
  }
  catch {
    return NextResponse.redirect(new URL("/login", origin));
  }
  return NextResponse.next({
    request: {
      ...request,
      headers: requestHeaders,
    },
  });
};

export const config = {
  matcher: "/((?!auth|_next/static|_next/image|favicon.ico|public|manifest.json|api/teacher/sheet/*).*)",
};