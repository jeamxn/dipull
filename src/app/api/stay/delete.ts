import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { getApplyEndDate, getApplyStartDate } from "./utils";

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
      message: "잔류 신청 기간이 아닙니다.",
    }), {
      status: 400,
      headers: new_headers
    });
  }

  // DB 접속
  const client = await connectToDatabase();
  const stayCollection = client.db().collection("stay");

  const mySelectQuery = { week: await getApplyStartDate(), owner: verified.payload.id };
  const deleteMySelect = await stayCollection.deleteOne(mySelectQuery);

  if(deleteMySelect.deletedCount) {
    return new NextResponse(JSON.stringify({
      success: true,
      message: "잔류 신청을 취소했습니다.",
    }), {
      status: 200,
      headers: new_headers
    });
  }
  else {
    return new NextResponse(JSON.stringify({
      success: false,
      message: "신청한 잔류가 없습니다.",
    }), {
      status: 400,
      headers: new_headers
    });
  }
};

export default DELETE;