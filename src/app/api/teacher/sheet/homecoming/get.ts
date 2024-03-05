import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { HomecomingDB } from "@/app/api/homecoming/utils";
import { OutingDB, defaultOutingData } from "@/app/api/outing/utils";
import { StayDB, getApplyStartDate } from "@/app/api/stay/utils";
import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";


import { SheetByGradeClassObj, SheetGradeClassInner, SheetResponse } from "./utils";

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
  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const selectMember = await userCollection.findOne({ id: verified.payload.data.id }) as unknown as UserDB;
  if(selectMember.type !== "teacher") return new NextResponse(JSON.stringify({
    message: "교사만 접근 가능합니다.",
  }), {
    status: 403,
    headers: new_headers
  });


  const homecomingCollection = client.db().collection("homecoming");
  const query = { week: await getApplyStartDate() };
  const result = await homecomingCollection.find(query).toArray() as unknown as HomecomingDB[];
  const byGradeClassObj: SheetByGradeClassObj = {};
  for(const e of result) {
    const user = await userCollection.findOne({ id: e.id }) as unknown as UserDB;
    if(!user?.id) continue;
    const grade = Math.floor(user.number / 1000);
    const classNum = Math.floor(user.number / 100) % 10;
    if(!byGradeClassObj[grade]) byGradeClassObj[grade] = {};
    if(!byGradeClassObj[grade][classNum]) byGradeClassObj[grade][classNum] = [];
    const pushData: SheetGradeClassInner = {
      id: user.id,
      name: user.name,
      number: user.number,
      gender: user.gender,
      week: e.week,
      reason: e.reason,
    };
    byGradeClassObj[grade][classNum].push(pushData);
  }
  
  const response: SheetResponse = {
    message: "성공적으로 데이터를 가져왔습니다.",
    data: byGradeClassObj,
    query
  };

  return new NextResponse(JSON.stringify(response), {
    headers: new_headers
  });
};

export default GET;