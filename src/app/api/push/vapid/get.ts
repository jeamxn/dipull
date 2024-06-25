import { headers } from "next/headers";
import { NextResponse } from "next/server";
import webpush from "web-push";

import { verify } from "@/utils/jwt";

type VapidKeys = {
  publicKey: string;
  privateKey: string;
};

const vapidKeys: VapidKeys = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
  "mailto:admin@chicken-moo.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const GET = async (
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

  return new NextResponse(JSON.stringify({
    publicKey: vapidKeys.publicKey
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;