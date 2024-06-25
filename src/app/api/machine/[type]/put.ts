import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { machineName } from "@/app/(login)/machine/[type]/utils";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { MachineDB, Params, getApplyEndTime, getApplyStartTime, getDefaultValue } from "./utils";

const PUT = async (
  req: Request,
  { params }: { params: Params }
) => {
  // 헤더 설정
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
  
  // Authorization 헤더 확인
  const authorization = headers().get("authorization");
  const accessToken = authorization?.split(" ")[1] || "";
  const verified = await verify(accessToken);
  if(!verified.ok || !verified.payload?.id || !verified.payload?.data.id) return new NextResponse(JSON.stringify({
    message: "로그인이 필요합니다.",
  }), {
    status: 401,
    headers: new_headers
  });

  const currentTime = moment(moment().tz("Asia/Seoul").format("HH:mm"), "HH:mm");
  const applyStartDate = moment(await getApplyStartTime(), "HH:mm");
  const applyEndDate = moment(await getApplyEndTime(), "HH:mm");
  if(currentTime.isBefore(applyStartDate) || currentTime.isAfter(applyEndDate)) {
    return new NextResponse(JSON.stringify({
      success: false,
      message: `${applyStartDate.format("HH시 mm분")}부터 ${applyEndDate.format("HH시 mm분")} 사이에 신청 가능합니다.`,
    }), {
      status: 400,
      headers: new_headers
    });
  }

  const { machine, time } = await req.json();

  const isStay = moment().tz("Asia/Seoul").day() === 0 || moment().tz("Asia/Seoul").day() === 6;
  const defaultData = await getDefaultValue(params.type, isStay);

  if(verified.payload.data.gender !== defaultData[machine].allow.gender)
    return new NextResponse(JSON.stringify({
      success: false,
      message: "성별이 맞지 않습니다.",
    }), {
      status: 400,
      headers: new_headers
    });

  if(!defaultData[machine].allow.grades.includes(Math.floor(verified.payload.data.number / 1000)))
    return new NextResponse(JSON.stringify({
      success: false,
      message: "학년이 맞지 않습니다.",
    }), {
      status: 400,
      headers: new_headers
    });

  const client = await connectToDatabase();
  const machineCollection = client.db().collection("machine");

  const isIBookedQuery = { type: params.type, date: moment().tz("Asia/Seoul").format("YYYY-MM-DD"), owner: verified.payload.data.id };
  const isIBooked = await machineCollection.findOne(isIBookedQuery);
  if(isIBooked) return new NextResponse(JSON.stringify({
    success: false,
    message: "이미 예약한 시간이 있습니다.",
  }), {
    status: 400,
    headers: new_headers
  });

  const query = { type: params.type, machine, time, date: moment().tz("Asia/Seoul").format("YYYY-MM-DD") };
  const result = await machineCollection.findOne(query);
  if(result) return new NextResponse(JSON.stringify({
    success: false,
    message: "이미 예약된 시간입니다.",
  }), {
    status: 400,
    headers: new_headers
  });

  const put_query: MachineDB = {
    machine,
    time,
    date: moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
    owner: verified.payload.data.id,
    type: params.type,
  };
  const put = await machineCollection.insertOne(put_query);

  const timeString = time.replace("오전", "am").replace("오후", "pm").replace("* ", "");
  const timeSet = moment(timeString, "a hh시 mm분");
  const timeMoment30 = timeSet.subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss");
  const timeMoment10 = timeSet.subtract(10, "minutes").format("YYYY-MM-DD HH:mm:ss");
  const notificationCollection = client.db().collection("notification");
  const notification_query = {
    id: verified.payload.data.id,
    payload: {
      title: `${params.type === "washer" ? "세탁" : "건조"}를 해야 해요!`,
      body: `${machineName(machine)} ${params.type === "washer" ? "세탁" : "건조"}기가 ${time}에 예약되어 있습니다.`,
    }
  };
  const notification_querys = [
    {
      ...notification_query,
      type: `machine-${params.type}-30`,
      time: timeMoment30,
    },
    {
      ...notification_query,
      type: `machine-${params.type}-10`,
      time: timeMoment10,
    }
  ];
  await notificationCollection.insertMany(notification_querys);


  if(!put.acknowledged) return new NextResponse(JSON.stringify({
    success: false,
    message: "예약에 실패했습니다.",
  }), {
    status: 500,
    headers: new_headers
  });

  return new NextResponse(JSON.stringify({
    success: true,
    message: "예약에 성공했습니다.",
    ret: {
      start: applyStartDate.format("HH:mm"),
      end: applyEndDate.format("HH:mm"),
      currentTime: currentTime.format("HH:mm"),
      ifBefore: currentTime.isBefore(applyStartDate),
      ifAfter: currentTime.isAfter(applyEndDate),
    }
  }), {
    status: 200,
    headers: new_headers
  });
};

export default PUT;