import moment from "moment";
import "moment-timezone";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import youtubeSearch from "youtube-search";

const opts: youtubeSearch.YouTubeSearchOptions = {
  maxResults: 5,
  key: process.env.YOUTUBE_API_KEY || "",
  type: "video",
};

const POST = async (
  req: Request,
) => {
  const x_origin = headers().get("x-origin") || "";
  const x_url = headers().get("x-url") || "";
  const redirect_to = decodeURIComponent(x_url.split("/auth/refresh?url=")[1]);

  try {
    const { query } = await req.json();
    if (!query) { 
      throw new Error("검색어를 입력해주세요.");
    }

    const { results } = await youtubeSearch(query, opts);
    const send = results.map((result) => ({
      id: result.id,
      title: result.title,
    }));
    
    const response = NextResponse.json({
      success: true,
      message: "e.message",
      data: send,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json({
      success: false,
      message: e.message,
    }, {
      status: 400,
    });
    console.error(e.message);
    return response;
  }
};

export default POST;