import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { AtheleticScoreDB } from "./utils";

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
  const atheleticScoreCollection = client.db().collection("atheletic_score");
  const count = {
    white: 0,
    blue: 0,
  };
  const all = await atheleticScoreCollection.find({}).toArray() as unknown as AtheleticScoreDB[];
  all.length && all.forEach((v) => {
    count[v.team] += parseInt(v.score);
  });
  const getDescriptions = all.map((v) => {
    return {
      team: v.team,
      score: v.score,
      description: v.description,
    };
  });

  return new NextResponse(JSON.stringify({
    ok: true,
    data: {
      count, getDescriptions
    },
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;