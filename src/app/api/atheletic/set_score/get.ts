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
  const atheleticScoreCollection = client.db().collection("atheletic_set_score");
  const count_score = {
    white: 0,
    blue: 0,
  };
  const count_set = {
    white: 0,
    blue: 0,
  };
  const all = await atheleticScoreCollection.find({}).toArray() as unknown as AtheleticScoreDB[];
  all.length && all.forEach((v) => {
    if(v.type === "score") {
      count_score[v.team] += parseInt(v.score);
    }
    else {
      count_set[v.team] += parseInt(v.score);
    }
  });

  return new NextResponse(JSON.stringify({
    ok: true,
    data: {
      score: count_score,
      sets: count_set, 
    },
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;