import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getStates } from "@/utils/getStates";
import { verify } from "@/utils/jwt";

import { getWakeupRanking } from "./server";

const GET = async (
  req: Request,
) => {
  // 헤더 설정
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
  
  // Authorization 헤더 확인
  const authorization = headers().get("authorization");
  const verified = await verify(authorization?.split(" ")[1] || "");
  if(!verified.ok || !verified.payload?.id) return new NextResponse(JSON.stringify({
    message: "로그인이 필요합니다.",
  }), {
    status: 401,
    headers: new_headers
  });

  const emergency = await getStates("emergency");
  if (emergency) return new NextResponse(JSON.stringify({
    message: "긴급 상황이 발생하였습니다.",
  }), {
    status: 500,
    headers: new_headers
  });

  const rt = await getWakeupRanking();

  return new NextResponse(JSON.stringify(rt), {
    status: 200,
    headers: new_headers
  });
};

export default GET;