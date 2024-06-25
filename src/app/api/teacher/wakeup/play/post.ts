import { isEmpty } from "lodash";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getApplyStartDate } from "@/app/api/stay/utils";
import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import instance from "@/utils/instance";
import { verify } from "@/utils/jwt";



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

  // DB 접속
  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const selectMember = await userCollection.findOne({ id: verified.payload.data.id }) as unknown as UserDB;
  if(selectMember.type !== "teacher") return new NextResponse(JSON.stringify({
    message: "교사만 접근 가능합니다.",
  }), {
    status: 403,
    headers: new_headers
  });

  const data = await req.json();
  if(isEmpty(data)) return new NextResponse(JSON.stringify({
    message: "잘못된 요청입니다.",
  }), {
    status: 400,
    headers: new_headers
  });
  
  const plyaed_wakeupCollection = client.db().collection("played_wakeup");
  
  const add = await plyaed_wakeupCollection.insertOne(data.putData);

  if(!add) return new NextResponse(JSON.stringify({
    message: "선정에 실패했습니다.",
  }), {
    status: 500,
    headers: new_headers
  });

  return new NextResponse(JSON.stringify({
    message: "성공적으로 선정되었습니다.",
  }), {
    status: 200,
    headers: new_headers
  });
  
};

export default POST;