import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { verify } from "@/utils/jwt";

import { getMachineData } from "./server";
import { Params } from "./utils";

const GET = async (
  req: Request,
  { params }: { params: Params }
) => {
  // 헤더 설정
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
  
  // Authorization 헤더 확인
  const authorization = headers().get("authorization");
  const verified = await verify(authorization?.split(" ")[1] || "");
  if(!verified.ok || !verified.payload?.id) {
    try {    
      const type = req.url.split("?")[1].split("=")[1];
      if(type !== process.env.TEACHERS_CODE) return new NextResponse(JSON.stringify({
        message: "로그인이 필요합니다.",
      }), {
        status: 401,
        headers: new_headers
      });
    }
    catch {
      return new NextResponse(JSON.stringify({
        message: "로그인이 필요합니다.",
      }), {
        status: 401,
        headers: new_headers
      });
    }
  }

  if(params.type !== "washer" && params.type !== "dryer") return new NextResponse(JSON.stringify({
    message: "잘못된 요청입니다.",
  }), {
    status: 400,
    headers: new_headers
  });

  const { defaultData, myBookData } = await getMachineData(params.type, verified.payload?.id || "");

  return new NextResponse(JSON.stringify({
    message: verified.ok ? "success" : "fail",
    data: defaultData,
    myBooking: myBookData,
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;