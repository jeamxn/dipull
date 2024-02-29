import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { verify } from "@/utils/jwt";

export const GET = async (req: Request) => {
  // 헤더 설정
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
    
  // Authorization 헤더 확인
  const authorization = headers().get("authorization");
  const verified = await verify(authorization?.split(" ")[1] || "");

  return new NextResponse(JSON.stringify({
    message: verified.ok ? "success" : "fail",
    payload: verified.payload || {},
  }), {
    status: 200,
    headers: new_headers
  });
};