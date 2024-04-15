import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { UserDB, UserData } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { JasupDB, JasupData, JasupWhere, getCurrentTime, getToday } from "../utils";

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

  const { number }: {
    number: number;
  } = await req.json();
  if(!number) return new NextResponse(JSON.stringify({
    message: "학생을 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  const client = await connectToDatabase();
  const usersCollection = client.db().collection<UserDB>("users");
  const user = await usersCollection.findOne({ number }) as unknown as UserDB;
  if(!user) return new NextResponse(JSON.stringify({
    message: "학생을 찾을 수 없습니다.",
  }), {
    status: 404,
    headers: new_headers
  });
  const data = {
    id: user.id,
    number: user.number,
    name: user.name,
    gender: user.gender,
  };
  
  return new NextResponse(JSON.stringify({
    message: "성공적으로 데이터를 가져왔습니다.",
    data,
  }), {
    status: 200,
    headers: new_headers
  });
};

export default POST;