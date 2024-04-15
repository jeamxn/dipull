import "moment-timezone";
import moment from "moment";
import { ValueOf } from "next/dist/shared/lib/constants";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { JasupBookDB, JasupTime, JasupTimeArray } from "../jasup/utils";
import { getApplyEndDate, getApplyStartDate, isStayApplyNotPeriod } from "../stay/utils";

import { HomecomingData, goTime } from "./utils";


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

  const { reason, time }: {
    reason: string;
    time: ValueOf<typeof goTime>;
  } = await req.json();
  if(!reason) return new NextResponse(JSON.stringify({
    success: false,
    message: "사유를 입력해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  if(!time) return new NextResponse(JSON.stringify({
    success: false,
    message: "귀가 시간을 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  const client = await connectToDatabase();
  const homecomingCollection = client.db().collection("homecoming");

  const my: HomecomingData = { 
    id: verified.payload.id,
    reason,
    time,
    week: await getApplyStartDate(),
  };
  const put = await homecomingCollection.updateOne({ 
    id: verified.payload.id, 
    week: await getApplyStartDate(),
  }, { 
    $set: my 
  }, { 
    upsert: true 
  });

  const jasupBookCollection = client.db().collection<JasupBookDB>("jasup_book");

  let timesJasup: JasupTime[] = [];
  if(time === "종례 후") {
    timesJasup = ["pm2", "night1", "night2"];
  }
  else if(time === "저녁시간") {
    timesJasup = ["night1", "night2"];
  }
  else if(time === "야자1 이후") {
    timesJasup = ["night2"];
  }

  const fri = moment(await getApplyStartDate()).day(5).format("YYYY-MM-DD");
  const putJasup = await jasupBookCollection.insertOne({
    id: verified.payload.id,
    days: [5],
    dates: {
      start: fri,
      end: fri,
    },
    times: timesJasup,
    type: "home",
    etc: "금요귀가",
  });

  if(put.acknowledged && putJasup.acknowledged) {
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