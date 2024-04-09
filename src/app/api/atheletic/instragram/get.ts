import moment from "moment";
import "moment-timezone";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { getInstagramPosts } from "./getInstagramPosts";

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
  const requestCollection = client.db().collection("atheletic_request");
  const my = await requestCollection.findOne({ id: verified.payload.id });
  if(my?.last_search) {
    const this_ = moment(my?.last_search || 0, "x");
    const now = moment().tz("Asia/Seoul");
    if(now.diff(this_, "seconds") < 15) return new NextResponse(JSON.stringify({
      message: `불러오기는 15초에 한 번만 가능합니다. (${15 - now.diff(this_, "seconds")}초 남음)`,
    }), {
      status: 429,
      headers: new_headers
    });
  }

  const atheleticInstragramCollection = client.db().collection("atheletic_instragram");
  await requestCollection.updateOne({ id: verified.payload.id }, {
    $set: {
      last_search: moment().tz("Asia/Seoul").valueOf(),
    }
  }, {
    upsert: true
  });
  const data = await getInstagramPosts();
  await atheleticInstragramCollection.deleteMany({});
  await atheleticInstragramCollection.insertMany(data);

  return new NextResponse(JSON.stringify({
    ok: true,
    data,
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;