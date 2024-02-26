import axios from "axios";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verify } from "@/utils/jwt";

export const middleware = async (request: NextRequest) => {
  const accessToken = ( cookies().get("accessToken")?.value || "" ) as string;
  console.log(accessToken, verify(accessToken));
  if(verify(accessToken).ok)
    return NextResponse.next();
  else
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_REDIRECT_URI!));

};

export const config = {
  matcher: "/((?!auth|_next/static|_next/image|favicon.ico|login).*)",
};