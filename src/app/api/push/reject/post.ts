import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

const POST = async (
  req: Request
) => {
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

  const { reject } = await req.json();

  const client = await connectToDatabase();
  const notificationCollection = client.db().collection("notification_settings");
  const notification = await notificationCollection.updateOne({
    user: verified.payload.id,
  }, {
    $set: {
      reject
    }
  }, {
    upsert: true,
  });

  if (!notification.modifiedCount && !notification.upsertedCount) return new NextResponse(JSON.stringify({
    message: "알림 설정 변경 실패",
  }), {
    status: 400,
    headers: new_headers
  });

  return new NextResponse(JSON.stringify({
    message: "알림 설정 변경 성공",
  }), {
    status: 200,
    headers: new_headers
  });
};

export default POST;