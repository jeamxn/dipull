import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { IwannagohomeDB } from "./utils";

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

  const currentTime = moment(moment().tz("Asia/Seoul").format("HH:mm"), "HH:mm");

  const client = await connectToDatabase();
  const iwannagohomeCollection = client.db().collection("iwannagohome");
  const myData = await iwannagohomeCollection.findOne({ id: verified.payload.id, date: currentTime.format("YYYY-MM-DD") }) as unknown as IwannagohomeDB;
  const count = [0, 0];
  const all = await iwannagohomeCollection.find({ date: currentTime.format("YYYY-MM-DD") }).toArray();
  all.length && all.forEach((v) => {
    count[v.pick]++;
  });

  return new NextResponse(JSON.stringify({
    ok: true,
    data: {
      my: myData?.pick,
      count,
    },
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;