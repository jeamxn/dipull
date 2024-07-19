import moment from "moment";
import "moment-timezone";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";
import { rand } from "@/utils/random";

import { getWakeupAvail } from "./server";

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

  const { type }: {
    type: "hol" | "jak"
  } = await req.json();
  const randNum = rand(1, 99);
  const success = type === "hol" ? randNum % 2 === 1 : randNum % 2 === 0;

  const client = await connectToDatabase();
  const wakeupAplyCollection = client.db().collection("wakeup_aply");
  const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
  await wakeupAplyCollection.updateOne({
    owner: verified.payload.id,
    date: today,
  }, {
    $mul: {
      available: success ? 2 : 0,
    }
  });

  const avl = await getWakeupAvail(verified.payload.id);

  return new NextResponse(JSON.stringify({
    success,
    message: success ? "맞추기에 성공했습니다!" : "맞추기에 실패했습니다.",
    number: randNum,
    available: avl.available,
  }), {
    status: 200,
    headers: new_headers
  });
  
};

export default POST;