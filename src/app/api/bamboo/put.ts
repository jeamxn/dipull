import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { limit } from "./utils";

const PUT = async (
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

  const { textarea, anonymous, grade } = await req.json();
  if(!textarea) return new NextResponse(JSON.stringify({
    message: "내용을 입력해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  else if(textarea.length > limit) return new NextResponse(JSON.stringify({
    message: `최대 ${limit}자까지 입력 가능합니다.`,
  }), {
    status: 400,
    headers: new_headers
  });
  
  const client = await connectToDatabase();
  const statesCollection = client.db().collection("states");
  const state = await statesCollection.findOneAndUpdate({
    type: "bamboo",
  }, {
    $inc: {
      count: 1,
    }
  }, {
    upsert: true,
    returnDocument: "after",
  });
  const bambooCollection = client.db().collection("bamboo");
  const { insertedId } = await bambooCollection.insertOne({
    user: verified.payload.id,
    text: textarea,
    timestamp: moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
    anonymous: anonymous, 
    grade: grade,
    number: state?.count,
  });

  if(!insertedId) return new NextResponse(JSON.stringify({
    message: "제보에 실패했습니다.",
  }), {
    status: 500,
    headers: new_headers
  });
  else return new NextResponse(JSON.stringify({
    message: "제보에 성공했습니다.",
  }), {
    status: 200,
    headers: new_headers
  });  
};

export default PUT;