import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

type PushSubscription = {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

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
  
  const subscription: PushSubscription = await req.json();

  const client = await connectToDatabase();
  const statesCollection = client.db().collection("subscriptions");

  await statesCollection.updateOne({
    id: verified.payload.id,
    userAgent: req.headers.get("user-agent") || "",
  }, {
    $set: {
      id: verified.payload.id,
      subscription: subscription,
      userAgent: req.headers.get("user-agent") || "",
    }
  }, {
    upsert: true,
  });

  return new NextResponse(JSON.stringify({
    message: "구독 성공"
  }), {
    status: 200,
    headers: new_headers
  });
};

export default POST;