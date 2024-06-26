import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { Timetable } from "@/app/cron/timetable/get";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { getTimetable } from "./server";

type Params = {
  grade: string;
  class: string;
};

export type TimetableResponse = {
  success: boolean;
  message: string;
  checksum: string;
  data: Timetable[][];
};

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
  if(!verified.ok || !verified.payload?.id) return new NextResponse(JSON.stringify({
    message: "로그인이 필요합니다.",
  }), {
    status: 401,
    headers: new_headers
  });

  if(!params.grade || !params.class) return new NextResponse(JSON.stringify({
    message: "학년과 반을 입력해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  if(isNaN(Number(params.grade)) || isNaN(Number(params.class))) return new NextResponse(JSON.stringify({
    message: "학년과 반은 숫자로 입력해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  try {
    const periodsObject= await getTimetable(Number(params.grade), Number(params.class));
  
    const response: TimetableResponse = {
      success: true,
      checksum: `${params.grade}${params.class}`,
      message: "시간표를 성공적으로 불러왔습니다.",
      data: periodsObject
    };
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: new_headers
    });
  }
  catch(e) {
    return new NextResponse(JSON.stringify({
      message: "시간표를 불러오는데 실패했습니다.",
    }), {
      status: 500,
      headers: new_headers
    });
  }
};

export default GET;