import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { UserInfo, UserInfo1Response } from "../utils";

const GET = async (
  req: Request,
  { params }: { params: {
    id: string,
  } }
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
  
  if(!params.id) return new NextResponse(JSON.stringify({
    message: "잘못된 요청입니다.",
  }), {
    status: 400,
    headers: new_headers
  });

  // DB 접속
  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");

  // name이 포함되거나
  const query = {  
    id: params.id
  };
  const result = await userCollection.findOne(query) as unknown as UserDB;
  const data: UserInfo = {
    id: result.id,
    gender: result.gender,
    name: result.name,
    number: result.number,
    profile_image: result.profile_image,
    type: result.type,
  };
  
  const stayResponse: UserInfo1Response = {
    message: "성공적으로 데이터를 가져왔습니다.",
    data,
  };

  return new NextResponse(JSON.stringify(stayResponse), {
    status: 200,
    headers: new_headers,
  });
};

export default GET;