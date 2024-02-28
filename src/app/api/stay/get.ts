import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { ByGradeClassObj, BySeatsObj, StayGetResponse, StayDB, getApplyStartDate } from "./utils";

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

  // DB 접속
  const client = await connectToDatabase();
  const stayCollection = client.db().collection("stay");
  const userCollection = client.db().collection("users");
  const query = { week: getApplyStartDate() };
  const result = await stayCollection.find(query).toArray() as unknown as StayDB[];

  const bySeatsObj: BySeatsObj = {};
  const byGradeClassObj: ByGradeClassObj = {};
  for(const e of result) {
    const user = await userCollection.findOne({ id: e.owner }) as unknown as UserDB;
    if(!user?.id) continue;
    if(!bySeatsObj[e.seat[0]]) bySeatsObj[e.seat[0]] = {};
    bySeatsObj[e.seat[0]][e.seat[1]] = `${user.number} ${user.name}`;

    const grade = Math.floor(user.number / 1000);
    const classNum = Math.floor(user.number / 100) % 10;
    if(!byGradeClassObj[grade]) byGradeClassObj[grade] = {};
    if(!byGradeClassObj[grade][classNum]) byGradeClassObj[grade][classNum] = [];
    const pushData = {
      id: user.id,
      name: user.name,
      number: user.number,
      gender: user.gender,
      seat: e.seat,
      week: e.week,
    };
    byGradeClassObj[grade][classNum].push(pushData);
  }

  const mySelectQuery = { week: getApplyStartDate(), owner: verified.payload.id };
  const mySelect = await stayCollection.findOne(mySelectQuery) as unknown as StayDB;
  const { seat } = mySelect || { seat: "" };

  const stayResponse: StayGetResponse = {
    message: "성공적으로 데이터를 가져왔습니다.",
    data: { 
      bySeatsObj, 
      byGradeClassObj,
      mySelect: seat,
    },
    query
  };

  return new NextResponse(JSON.stringify(stayResponse), {
    status: 200,
    headers: new_headers
  });
};

export default GET;