import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { JasupBookDB, JasupBookPutData } from "../utils";

const PUT = async (
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

  const { days, dates, times, type, etc }: JasupBookPutData = await req.json();
  if(!days || !days.length) return new NextResponse(JSON.stringify({
    message: "요일을 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  if(!dates || !dates.start || !dates.end) return new NextResponse(JSON.stringify({
    message: "날짜를 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  if(!times || !times.length) return new NextResponse(JSON.stringify({
    message: "시간을 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  if(!type || type === "none") return new NextResponse(JSON.stringify({
    message: "장소를 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  if(!etc && (type === "etcroom" || type === "outing" || type === "afterschool")) return new NextResponse(JSON.stringify({
    message: "자세한 위치를 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  const client = await connectToDatabase();
  const jasupBookCollection = client.db().collection<JasupBookDB>("jasup_book");

  const put = await jasupBookCollection.insertOne({
    id: verified.payload.id,
    days,
    dates,
    times,
    type,
    etc,
  });
  if(!put.acknowledged) return new NextResponse(JSON.stringify({
    message: "예약에 실패했습니다.",
  }), {
    status: 500,
    headers: new_headers
  });
  return new NextResponse(JSON.stringify({
    message: "성공적으로 예약을 추가했습니다.",
  }), {
    status: 200,
    headers: new_headers
  });
};

export default PUT;