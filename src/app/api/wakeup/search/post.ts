import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import youtubeSearch from "youtube-search";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

const opts: youtubeSearch.YouTubeSearchOptions = {
  maxResults: 10,
  key: process.env.YOUTUBE_API_KEY || "",
};

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

  const { query } = await req.json();
  if(!query) return new NextResponse(JSON.stringify({
    message: "검색어를 입력해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  try{
    const search = await youtubeSearch(query, opts);
    return new NextResponse(JSON.stringify({
      message: "성공적으로 검색되었습니다.",
      search: search.results,
    }), {
      headers: new_headers
    });
  }
  catch(e: any){
    return new NextResponse(JSON.stringify({
      message: e.message,
    }), {
      status: 500,
      headers: new_headers
    });
  }

};

export default POST;