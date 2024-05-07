import "moment-timezone";
import axios from "axios";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { verify } from "@/utils/jwt";

import { LuckData } from "./utils";

const POST = async (
  req: Request
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

  const { date } = await req.json();

  const { data: { flick } } = await axios.get("https://m.search.naver.com/p/csearch/content/apirender.nhn", {
    params: {
      "where": "nexearch",
      "u2": date,
      "q": "생년월일 운세",
      "u3": "solar"
    }
  });

  const convert = flick.map((item: any) => 
    item.replace(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g, "")
      .split("  ")
      .filter((item: string) => item && item !== " ")
  )[0];

  const data: LuckData = {
    "총운": convert[8].replace(` ${moment().tz("Asia/Seoul").format("YYYY.MM.DD")}`, "."),
    "애정운": convert[10],
    "금전운": convert[12],
    "직장운": convert[14],
    "학업, 성적운": convert[16],
    "건강운": convert[18],
  };

  return new NextResponse(JSON.stringify({
    message: "운세 조회 성공",
    data,
  }), {
    status: 200,
    headers: new_headers
  });
};

export default POST;