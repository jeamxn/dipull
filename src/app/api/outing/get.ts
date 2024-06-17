import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getApplyStartDate } from "@/app/api/stay/utils";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";


import { OutingDB, OutingGetResponse, defaultOutingData } from "./utils";

export const getOuting = async (id: string) => { 
  const client = await connectToDatabase();
  const outingCollection = client.db().collection("outing");
  const query = { owner: id, week: await getApplyStartDate() };
  const result = await outingCollection.findOne(query) as unknown as OutingDB | null;
  return result ? {
    sat: result.sat,
    sun: result.sun,
  } : {
    sat: defaultOutingData,
    sun: defaultOutingData,
  };
};

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
  
  // db connect
  const client = await connectToDatabase();
  const outingCollection = client.db().collection("outing");
  const query = { owner: verified.payload.data.id, week: await getApplyStartDate() };
  const result = await outingCollection.findOne(query) as unknown as OutingDB | null;

  const resData: OutingGetResponse = {
    success: true,
    data: await getOuting(verified.payload.data.id),
  };

  return new NextResponse(JSON.stringify(resData), {
    status: 200,
    headers: new_headers
  });
};

export default GET;