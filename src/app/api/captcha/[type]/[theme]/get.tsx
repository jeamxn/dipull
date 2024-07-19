import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import React from "react";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";
import { rand } from "@/utils/random";

import Component from "./component";

const GET = async (
  req: Request,
  { params }: {
    params: {
      type: "json" | "raw";
      theme: "light" | "dark";
    }
  }
) => {
  // 헤더 설정
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
  
  // Authorization 헤더 확인
  // const authorization = headers().get("authorization");
  // const verified = await verify(authorization?.split(" ")[1] || "");
  // if(!verified.ok || !verified.payload?.id) return new NextResponse(JSON.stringify({
  //   message: "로그인이 필요합니다.",
  // }), {
  //   status: 401,
  //   headers: new_headers
  // });

  if (params.type !== "json" && params.type !== "raw") return new NextResponse(JSON.stringify({
    message: "잘못된 요청입니다.",
  }), {
    status: 400,
    headers: new_headers
  });
  if (params.theme !== "light" && params.theme !== "dark") return new NextResponse(JSON.stringify({
    message: "잘못된 요청입니다.",
  }), {
    status: 400,
    headers: new_headers
  });

  const string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randString = Array(6).fill(0).map(() => string[rand(0, string.length)]).join("");

  const image = new ImageResponse(
    <Component
      random={randString}
      darkmode={params.theme === "dark"}
    />,
    {
      width: 2000,
      height: 600,
    }
  );

  if(params.type === "raw") return image;

  const readableStream = image.body;
  const read = await readableStream?.getReader().read();
  const base64 = Buffer.from(read?.value!).toString("base64");
  const until = moment().tz("Asia/Seoul").add(1 + (1 / 60), "minutes").format("YYYY-MM-DD HH:mm:ss");

  const client = await connectToDatabase();
  const captchaCollection = client.db().collection("captcha");
  const insert = await captchaCollection.insertOne({
    number: randString,
    image: base64,
    until,
  });

  return new NextResponse(JSON.stringify({
    id: insert.insertedId,
    image: `data:image/png;base64,${base64}`,
    until,
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;