import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { deleteMachineNotification } from "@/app/api/machine/[type]/server";
import { Params, getApplyEndTime, getApplyStartTime } from "@/app/api/machine/[type]/utils";
import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";


const POST = async (
  req: Request,
  { params }: { params: Params }
) => {
  // 헤더 설정
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
  
  // Authorization 헤더 확인
  const authorization = headers().get("authorization");
  const accessToken = authorization?.split(" ")[1] || "";
  const verified = await verify(accessToken);
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

  const { id } = await req.json();
  if (!id) return new NextResponse(JSON.stringify({
    message: "학생을 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  const machineCollection = client.db().collection("machine");
  const query = { type: params.type, date: moment().tz("Asia/Seoul").format("YYYY-MM-DD"), owner: id };
  const result = await machineCollection.deleteOne(query);

  await deleteMachineNotification(id, params.type);

  if(!result.acknowledged) return new NextResponse(JSON.stringify({
    success: false,
    message: "예약된 시간이 없습니다.",
  }), {
    status: 500,
    headers: new_headers
  });

  return new NextResponse(JSON.stringify({
    success: true,
    message: "예약이 취소되었습니다.",
  }), {
    status: 200,
    headers: new_headers
  });
};

export default POST;