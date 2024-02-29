import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { UserInfo, UserInfoResponse } from "./utils";

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

  const { name } = await req.json();

  if(!name) return new NextResponse(JSON.stringify({
    message: "이름을 입력해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  // name이 포함되거나
  const query = {  
    name: { $regex: name, $options: "i" }
  }
  ;
  const options = {
    // 15개만 가져오기
    limit: 15
  };
  const result = await userCollection.find(query, options).toArray() as unknown as UserDB[];
  const data: UserInfo[] = result.map(e => ({
    id: e.id,
    gender: e.gender,
    name: e.name,
    number: e.number,
  }));
  
  const stayResponse: UserInfoResponse = {
    message: "성공적으로 데이터를 가져왔습니다.",
    data,
  };

  return new NextResponse(JSON.stringify(stayResponse), {
    status: 200,
    headers: new_headers,
  });
};

export default POST;