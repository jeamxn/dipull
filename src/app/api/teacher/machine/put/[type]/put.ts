import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { MachineDB, Params, getDefaultValue } from "@/app/api/machine/[type]/utils";
import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

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

  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const selectMember = await userCollection.findOne({ id: verified.payload.data.id }) as unknown as UserDB;
  if(selectMember.type !== "teacher") return new NextResponse(JSON.stringify({
    message: "교사만 접근 가능합니다.",
  }), {
    status: 403,
    headers: new_headers
  });

  const { machine, time, id } = await req.json();
  if (!id) return new NextResponse(JSON.stringify({
    message: "학생을 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  const user = await userCollection.findOne({ id }) as unknown as UserDB;


  const isStay = moment().tz("Asia/Seoul").day() === 0 || moment().tz("Asia/Seoul").day() === 6;
  const defaultData = await getDefaultValue(params.type, isStay);

  if(user.gender !== defaultData[machine].allow.gender)
    return new NextResponse(JSON.stringify({
      success: false,
      message: "성별이 맞지 않습니다.",
    }), {
      status: 400,
      headers: new_headers
    });

  const machineCollection = client.db().collection("machine");

  const isIBookedQuery = { type: params.type, date: moment().tz("Asia/Seoul").format("YYYY-MM-DD"), owner: id };
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
    owner: id,
    type: params.type,
  };
  const put = await machineCollection.insertOne(put_query);

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
  }), {
    status: 200,
    headers: new_headers
  });
};

export default PUT;