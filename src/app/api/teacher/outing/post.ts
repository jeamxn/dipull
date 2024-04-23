import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { OutingDB, OutingGetResponse, defaultOutingData } from "@/app/api/outing/utils";
import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { getApplyStartDate } from "../../stay/utils";

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

  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const selectMember = await userCollection.findOne({ id: verified.payload.data.id }) as unknown as UserDB;
  if(selectMember.type !== "teacher") return new NextResponse(JSON.stringify({
    message: "교사만 접근 가능합니다.",
  }), {
    status: 403,
    headers: new_headers
  });

  const { owner } = await req.json();

  if(!owner) return new NextResponse(JSON.stringify({
    message: "학생을 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  
  // db connect
  const outingCollection = client.db().collection("outing");
  const query = { owner: owner, week: await getApplyStartDate() };
  const result = await outingCollection.findOne(query) as unknown as OutingDB | null;

  const resData: OutingGetResponse = {
    success: true,
    data: result ? {
      sat: result.sat,
      sun: result.sun,
    } : {
      sat: defaultOutingData,
      sun: defaultOutingData,
    }
  };

  return new NextResponse(JSON.stringify(resData), {
    status: 200,
    headers: new_headers
  });
};

export default POST;