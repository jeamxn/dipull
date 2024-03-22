import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { getApplyStartDate } from "../stay/utils";

import { HomecomingDB } from "./utils";


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

  const client = await connectToDatabase();
  const homecomingCollection = client.db().collection("homecoming");
  const my = { id: verified.payload.id, week: await getApplyStartDate() };
  const data = await homecomingCollection.findOne(my) as unknown as HomecomingDB;

  return new NextResponse(JSON.stringify({
    ok: true,
    data: {
      id: data?._id || verified.payload.id,
      reason: data?.reason || "",
      time: data?.time || "",
    },
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;