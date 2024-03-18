import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { getApplyEndDate, getApplyStartDate, isStayApplyNotPeriod } from "../stay/utils";

import { HomecomingData } from "./utils";


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

  if(Math.floor(verified.payload.data.number / 1000) !== 3) return new NextResponse(JSON.stringify({
    success: false,
    message: "3학년만 금요귀가 신청이 가능합니다.",
  }), {
    status: 403,
    headers: new_headers
  });

  const { reason } = await req.json();
  if(!reason) return new NextResponse(JSON.stringify({
    success: false,
    message: "사유를 입력해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });


  const client = await connectToDatabase();
  const homecomingCollection = client.db().collection("homecoming");
  const stayCollection = client.db().collection("stay");
  const mySelectQuery = { week: await getApplyStartDate(), owner: verified.payload.id };
  const mySelect = await stayCollection.findOne(mySelectQuery);
  if(mySelect) return new NextResponse(JSON.stringify({
    success: false,
    message: "금요귀가 신청을 하려면 잔류 신청을 취소해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  const my: HomecomingData = { 
    id: verified.payload.id,
    reason,
    week: await getApplyStartDate(),
  };
  const put = await homecomingCollection.updateOne({ id: verified.payload.id, week: await getApplyStartDate() }, { $set: my }, { upsert: true });

  if(put.acknowledged) {
    return new NextResponse(JSON.stringify({
      success: true,
      message: "금요귀가 신청이 완료되었습니다.",
    }), {
      status: 200,
      headers: new_headers
    });
  }
  return new NextResponse(JSON.stringify({
    success: false,
    message: "금요귀가 신청에 실패했습니다.",
  }), {
    status: 500,
    headers: new_headers
  });
};

export default PUT;