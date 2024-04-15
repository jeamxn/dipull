import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { JasupDB, JasupData, JasupWhere, getCurrentTime, getToday } from "../utils";

const POST = async (
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

  const today = getToday().format("YYYY-MM-DD");
  const current = getCurrentTime();

  const client = await connectToDatabase();
  const jasupCollection = client.db().collection<JasupDB>("jasup");

  const { date, time, gradeClass }: {
    date: JasupData["date"];
    time: JasupData["time"];
    gradeClass: JasupData["gradeClass"];
  } = await req.json();
  const queryOfGradeClass = gradeClass ? { gradeClass } : {};

  const data = await jasupCollection.findOne({
    id: verified.payload.id,
    date: date || today,
    time: time || current,
    ...queryOfGradeClass,
  });

  return new NextResponse(JSON.stringify({
    message: "성공적으로 데이터를 가져왔습니다.",
    data: {
      type: data?.type || "none",
      etc: data?.etc || "",
    },
  }), {
    status: 200,
    headers: new_headers
  });
};

export default POST;