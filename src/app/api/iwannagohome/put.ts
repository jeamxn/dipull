import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getApplyStartDate } from "@/app/api/stay/utils";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";


const PUT = async (
  req: Request,
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

  const { pick } = await req.json();
  if(typeof pick !== "number" || pick < 0 || pick > 1) return new NextResponse(JSON.stringify({
    message: "잘못된 요청입니다.",
  }), {
    status: 400,
    headers: new_headers
  });

  const date = await getApplyStartDate();

  const client = await connectToDatabase();
  const iwannagohomeCollection = client.db().collection("iwannagohome");

  const getMyQuery = {
    id: verified.payload.data.id,
    date: date,
  };
  const myData = await iwannagohomeCollection.findOne(getMyQuery);
  const update = await iwannagohomeCollection.updateOne(getMyQuery, {
    $set: {
      pick: myData?.pick === pick ? -1 : pick,
    }
  }, {
    upsert: true,
  });

  if(update.acknowledged) {
    return new NextResponse(JSON.stringify({
      ok: true,
    }), {
      status: 200,
      headers: new_headers
    });
  }

  return new NextResponse(JSON.stringify({
    message: "오류가 발생했습니다.",
    ok: false,
  }), {
    status: 200,
    headers: new_headers
  });
};

export default PUT;