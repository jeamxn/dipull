import moment from "moment";
import "moment-timezone";
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

  const { type, bat }: {
    type: "hol" | "jak",
    bat: string,
  } = await req.json();
  const randNum = rand(1, 99);
  const success = type === "hol" ? randNum % 2 === 1 : randNum % 2 === 0;
  const batInt = parseInt(bat);
  if(isNaN(batInt)) return new NextResponse(JSON.stringify({
    message: "올바르지 않은 배팅입니다.",
  }), {
    status: 400,
    headers: new_headers
  });
  const avl1 = await getWakeupAvail(verified.payload.id);
  if(avl1.available < batInt) return new NextResponse(JSON.stringify({
    message: "신청권보다 많은 배팅은 할 수 없습니다.",
  }), {
    status: 400,
    headers: new_headers
  });

  const client = await connectToDatabase();
  const wakeupAplyCollection = client.db().collection("wakeup_aply");
  const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
  await wakeupAplyCollection.updateOne({
    owner: verified.payload.id,
    date: today,
  }, {
    $inc: {
      available: batInt * (success ? 1 : -1),
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