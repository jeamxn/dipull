import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { getApplyEndDate, getApplyStartDate, isStayApplyNotPeriod } from "../stay/utils";

const DELETE = async (
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

  
  const currentTime = moment(moment().tz("Asia/Seoul").format("YYYY-MM-DD"), "YYYY-MM-DD");
  const applyStartDate = moment(await getApplyStartDate());
  const applyEndDate = moment(await getApplyEndDate());
  if(currentTime.isBefore(applyStartDate) || currentTime.isAfter(applyEndDate)) {
    return new NextResponse(JSON.stringify({
      success: false,
      message: "금요귀가 신청 기간이 아닙니다.",
    }), {
      status: 400,
      headers: new_headers
    });
  }

  const client = await connectToDatabase();
  const homecomingCollection = client.db().collection("homecoming");
  const my = { id: verified.payload.id, week: await getApplyStartDate() };

  const fri = moment(await getApplyStartDate()).day(5).format("YYYY-MM-DD");
  const jasupBookCollection = client.db().collection("jasup_book");
  const myBook = await jasupBookCollection.deleteOne({ 
    id: verified.payload.id,
    days: [5],
    dates: {
      start: fri,
      end: fri,
    },
    type: "home",
    etc: "금요귀가",
  });

  const delete_ = await homecomingCollection.deleteOne(my);

  if(delete_.deletedCount === 0) return new NextResponse(JSON.stringify({
    success: false,
    message: "금요귀가 신청이 존재하지 않습니다.",
  }), {
    status: 400,
    headers: new_headers
  });

  return new NextResponse(JSON.stringify({
    success: true,
    message: "금요귀가 신청이 취소되었습니다.",
  }), {
    status: 200,
    headers: new_headers
  });
};

export default DELETE;