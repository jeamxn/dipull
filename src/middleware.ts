import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const middleware = async (request: Readonly<NextRequest>) => {
  const origin = request.nextUrl.origin;
  // const refreshToken = cookies().get("refreshToken")?.value || "";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);
  requestHeaders.set("x-origin", origin);

  try{
    const userAgent = requestHeaders.get("user-agent");
    if(userAgent?.includes("KAKAOTALK")){
      return NextResponse.redirect(`kakaotalk://web/openExternal?url=${encodeURIComponent(request.url)}`);
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
  matcher: "/((?!auth|_next/static|_next/image|favicon.ico|public|cron|manifest.json).*)",
};