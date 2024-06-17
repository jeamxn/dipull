import "moment-timezone";
import { machine } from "os";

import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { UserData } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { MachineDB, Params, getApplyStartTime, getDefaultValue } from "./utils";

export const getMachineData = async (type: "washer" | "dryer", userId: string) => {
  const client = await connectToDatabase();
  const machineCollection = client.db().collection("machine");
  const query = { type: type, date: moment().tz("Asia/Seoul").format("YYYY-MM-DD") };
  const aggregationPipeline = [
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "id",
        as: "userInfo"
      }
    },
    {
      $unwind: "$userInfo"
    },
    {
      $project: {
        _id: 0,
        id: "$owner",
        name: "$userInfo.name",
        number: "$userInfo.number",
        machine: "$machine",
        time: "$time",
        date: "$date",
        type: "$type",
      }
    },
    {
      $match: query
    }
  ];
  const result = await machineCollection.aggregate(aggregationPipeline).toArray();

  const isStay = moment().tz("Asia/Seoul").day() === 0 || moment().tz("Asia/Seoul").day() === 6;

  const defaultData = getDefaultValue(type, isStay);
  const currentTime = moment(moment().tz("Asia/Seoul").format("HH:mm"), "HH:mm");
  const applyStartDate = moment(await getApplyStartTime(), "HH:mm");
  if (currentTime.isSameOrAfter(applyStartDate)) {
    for (const item of result) {
      defaultData[item.machine].time[item.time] = `${item.number} ${item.name}`;
    }
  }

  const myBookQuery = { type: type, date: moment().tz("Asia/Seoul").format("YYYY-MM-DD"), owner: userId };
  const myBook = await machineCollection.findOne(myBookQuery) as unknown as MachineDB || null;
  const myBookData: {
    booked: boolean;
    info: MachineDB;
  } = currentTime.isSameOrAfter(applyStartDate) && myBook ? {
    booked: true,
    info: myBook,
  } : {
    booked: false,
    info: {
      machine: "",
      time: "",
      date: "",
      owner: "",
      type: type,
    }
  };
  
  return { defaultData, myBookData };
};

const GET = async (
  req: Request,
  { params }: { params: Params }
) => {
  // 헤더 설정
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
  
  // Authorization 헤더 확인
  const authorization = headers().get("authorization");
  const verified = await verify(authorization?.split(" ")[1] || "");
  if(!verified.ok || !verified.payload?.id) {
    try {    
      const type = req.url.split("?")[1].split("=")[1];
      if(type !== process.env.TEACHERS_CODE) return new NextResponse(JSON.stringify({
        message: "로그인이 필요합니다.",
      }), {
        status: 401,
        headers: new_headers
      });
    }
    catch {
      return new NextResponse(JSON.stringify({
        message: "로그인이 필요합니다.",
      }), {
        status: 401,
        headers: new_headers
      });
    }
  }

  if(params.type !== "washer" && params.type !== "dryer") return new NextResponse(JSON.stringify({
    message: "잘못된 요청입니다.",
  }), {
    status: 400,
    headers: new_headers
  });

  const { defaultData, myBookData } = await getMachineData(params.type, verified.payload?.id || "");

  return new NextResponse(JSON.stringify({
    message: verified.ok ? "success" : "fail",
    data: defaultData,
    myBooking: myBookData,
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;