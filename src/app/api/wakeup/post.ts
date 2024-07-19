import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { getApplyStartDate } from "../stay/utils";

import { getWakeupAvail } from "./apply/server";
import { getToday } from "./utils";

const POST = async (
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

  const { _id } = await req.json();
  if(!_id) return new NextResponse(JSON.stringify({
    message: "잘못된 요청입니다.",
  }), {
    status: 400,
    headers: new_headers
  });
  
  const week = await getApplyStartDate();
  const client = await connectToDatabase();
  const wakeupCollection = client.db().collection("wakeup");
  const objcet_id = ObjectId.createFromHexString(_id);
  const query = {
    week: week,
    owner: verified.payload.id,
    _id: objcet_id,
    gender: verified.payload.data.gender,
  };
  const data = await wakeupCollection.deleteOne(query);
  const wakeupAplyCollection = client.db().collection("wakeup_aply");
  await wakeupAplyCollection.updateOne({
    owner: verified.payload.id,
    date: week,
  }, {
    $inc: {
      available: 1,
    }
  });
  const myAvail = await getWakeupAvail(verified.payload.id);

  if(data.deletedCount === 0) return new NextResponse(JSON.stringify({
    message: "삭제에 실패했습니다.",
    available: myAvail.available,
  }), {
    status: 500,
    headers: new_headers
  });

  return new NextResponse(JSON.stringify({
    message: "성공적으로 삭제되었습니다.",
    available: myAvail.available,
  }), {
    status: 200,
    headers: new_headers
  });
  
};

export default POST;