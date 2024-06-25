import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { NotificationPayload, sendPushNotification } from "./server";

const POST = async (
  req: Request
) => {
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");

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
  
  const {
    filter,
    payload
  }: {
    filter: string | string[],
    payload: NotificationPayload
  } = await req.json();

  await sendPushNotification(filter, payload);

  return new NextResponse(JSON.stringify({
    message: "알림 전송 완료"
  }), {
    status: 200,
    headers: new_headers
  });
};

export default POST;