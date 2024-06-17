import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { getStates } from "@/utils/getStates";
import { verify } from "@/utils/jwt";

import { getStayApply } from "./server";
import { ByGradeClassObj, BySeatsObj, StayGetResponse, StayDB, getApplyStartDate, StudyroomDB, StudyroomData, GradeClassInner } from "./utils";

const GET = async (
  req: Request,
) => {
  // 헤더 설정
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
  
  // Authorization 헤더 확인
  const authorization = headers().get("authorization");
  const verified = await verify(authorization?.split(" ")[1] || "");
  if (!verified.ok || !verified.payload?.id) return new NextResponse(JSON.stringify({
    message: "로그인이 필요합니다.",
  }), {
    status: 401,
    headers: new_headers
  });

  const stayResponse: StayGetResponse = {
    message: "성공적으로 데이터를 가져왔습니다.",
    ...await getStayApply(verified.payload.id),
  };

  return new NextResponse(JSON.stringify(stayResponse), {
    status: 200,
    headers: new_headers,
  });
};

export default GET;