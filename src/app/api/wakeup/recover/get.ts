import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { getApplyStartDate } from "../../stay/utils";
import { getWakeupAvail } from "../apply/server";
import { defaultWakeupAvail } from "../apply/utils";
import { getWakeup } from "../server";

const GET = async (
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

  const av = (await getWakeupAvail(verified.payload.id)).available;
  const my = (await getWakeup(verified.payload.data.id, verified.payload.data.gender)).my.length;
  const sum = av + my;
  if (sum >= defaultWakeupAvail) {
    return new NextResponse(JSON.stringify({
      message: "당신은 꼴아박지 않았군요...",
    }), {
      status: 400,
      headers: new_headers
    });
  }
  
  const client = await connectToDatabase();
  const wakeupAplyCollection = client.db().collection("wakeup_aply");
  const week = await getApplyStartDate();
  await wakeupAplyCollection.updateOne({
    owner: verified.payload.id,
    date: week,
  }, {
    $set: {
      available: defaultWakeupAvail,
    }
  });

  return new NextResponse(JSON.stringify({
    message: "성공적으로 꼴아박았습니다. 🥳",
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;