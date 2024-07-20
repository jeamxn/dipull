import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { getApplyStartDate } from "../../stay/utils";
import { getWakeupAvail } from "../apply/server";
import { defaultWakeupAvail } from "../apply/utils";

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

  const { amount, id }: {
    amount: string,
    id: string,
  } = await req.json();
  const amountInt = parseInt(amount);
  if (isNaN(amountInt)) return new NextResponse(JSON.stringify({
    message: "올바르지 않은 기부량입니다.",
  }), {
    status: 400,
    headers: new_headers
  });
  if (amountInt <= 0) return new NextResponse(JSON.stringify({
    message: "1개 이상의 신청권을 기부해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  const av = (await getWakeupAvail(verified.payload.id)).available;
  if (av < amountInt) return new NextResponse(JSON.stringify({
    message: "신청권보다 많은 기부는 할 수 없습니다.",
  }), {
    status: 400,
    headers: new_headers
  });
  
  const client = await connectToDatabase();
  const wakeupAplyCollection = client.db().collection("wakeup_aply");
  const week = await getApplyStartDate();
  const find = await wakeupAplyCollection.findOne({
    owner: id,
    date: week,
  });
  if (!find) {
    await wakeupAplyCollection.insertOne({
      owner: id,
      date: week,
      available: amountInt + defaultWakeupAvail,
    });
  }

  const promises = [
    wakeupAplyCollection.updateOne({
      owner: verified.payload.id,
      date: week,
    }, {
      $inc: {
        available: -1 * amountInt,
      }
    }),
    wakeupAplyCollection.updateOne({
      owner: id,
      date: week,
    }, {
      $inc: {
        available: amountInt,
      }
    })
  ];
  await Promise.all(promises);

  const av1 = (await getWakeupAvail(verified.payload.id)).available;


  return new NextResponse(JSON.stringify({
    message: "성공적으로 신청권을 선물하였습니다.",
    avail: av1,
  }), {
    status: 200,
    headers: new_headers
  });
};

export default POST;