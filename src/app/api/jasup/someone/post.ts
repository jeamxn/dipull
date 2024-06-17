import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { JasupBookDB, JasupDB, JasupData, getCurrentTime, getToday } from "../utils";

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

  const todayMoment = getToday();
  const today = todayMoment.format("YYYY-MM-DD");
  const current = getCurrentTime();

  const client = await connectToDatabase();
  const jasupCollection = client.db().collection<JasupDB>("jasup");

  const { date, time, gradeClass, id }: {
    id: JasupData["id"];
    date: JasupData["date"];
    time: JasupData["time"];
    gradeClass: JasupData["gradeClass"];
  } = await req.json();
  const queryOfGradeClass = gradeClass ? { gradeClass } : {};
  if(!id) return new NextResponse(JSON.stringify({
    message: "학생을 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  const data = await jasupCollection.findOne({
    id: id,
    date: date || today,
    time: time || current,
    ...queryOfGradeClass,
  });

  const jasupBookCollection = client.db().collection("jasup_book");
  const mys = await jasupBookCollection.find({
    id: id,
    days: { $elemMatch: { $eq: date ? moment(date, "YYYY-MM-DD").day() : todayMoment.day() } },
    times: { $elemMatch: { $eq: time || current } },
  }).toArray() as unknown as JasupBookDB[];
  const my = mys.length ? mys.reverse().find((e) => e.dates.start <= (date || today) && e.dates.end >=  (date || today)) || {} as JasupBookDB : {} as JasupBookDB;

  return new NextResponse(JSON.stringify({
    message: "성공적으로 데이터를 가져왔습니다.",
    data: {
      type: data?.type || my?.type || "none",
      etc: data?.etc || my?.etc || "",
    },
  }), {
    status: 200,
    headers: new_headers
  });
};

export default POST;