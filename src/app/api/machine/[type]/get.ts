import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { UserData } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { MachineDB, Params, getDefaultValue } from "./route";

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
  if(!verified.ok) return new NextResponse(JSON.stringify({
    message: "로그인이 필요합니다.",
  }), {
    status: 401,
    headers: new_headers
  });

  if(params.type !== "washer" && params.type !== "dryer") return new NextResponse(JSON.stringify({
    message: "잘못된 요청입니다.",
  }), {
    status: 400,
    headers: new_headers
  });

  // DB에서 불러오기
  const client = await connectToDatabase();
  const machineCollection = client.db().collection("machine");
  const userCollection = client.db().collection("users");
  const query = { type: params.type, date: moment().tz("Asia/Seoul").format("YYYY-MM-DD") };
  const result = await machineCollection.find(query).toArray() as unknown as MachineDB[];

  const isStay = moment().tz("Asia/Seoul").day() === 0 || moment().tz("Asia/Seoul").day() === 6;

  const defaultData = getDefaultValue(params.type, isStay);
  for(const item of result) {
    const userData = await userCollection.findOne({ id: item.owner }) as unknown as UserData;
    defaultData[item.machine].time[item.time] = `${userData.number} ${userData.name}`;
  }

  const myBookQuery = { type: params.type, date: moment().tz("Asia/Seoul").format("YYYY-MM-DD"), owner: verified.userId };
  const myBook = await machineCollection.findOne(myBookQuery) as unknown as MachineDB || null;
  const myBookData: {
    booked: boolean;
    info: MachineDB;
  } = myBook ? {
    booked: true,
    info: myBook,
  } : {
    booked: false,
    info: {
      machine: "",
      time: "",
      date: "",
      owner: "",
      type: "",
    }
  };
  
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