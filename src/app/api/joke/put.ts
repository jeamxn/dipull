import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

const PUT = async (
  req: Request
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
  
  const client = await connectToDatabase();
  const jokeCollection = client.db().collection("joke");
  const add = await jokeCollection.updateOne({
    id: verified.payload.data.id,
  }, {
    $set: {
      id: verified.payload.data.id,
    }
  }, {
    upsert: true,
  });

  if(add.upsertedId) {
    return new NextResponse(JSON.stringify({
      ok: true,
    }), {
      status: 200,
      headers: new_headers
    });
  }
  else {
    return new NextResponse(JSON.stringify({
      message: "오류가 발생했습니다.",
    }), {
      status: 500,
      headers: new_headers
    });
  }
};

export default PUT;