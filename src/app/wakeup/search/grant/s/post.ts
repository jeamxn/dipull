import moment from "moment";
import "moment-timezone";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import youtubeSearch from "youtube-search";

import { collections } from "@/utils/db";
import { accessVerify } from "@/utils/jwt";

import { YTSearchResponse } from "./utils";

const opts: youtubeSearch.YouTubeSearchOptions = {
  maxResults: 5,
  key: process.env.YOUTUBE_API_KEY || "",
  type: "video",
};

const POST = async (
  req: NextRequest,
) => {
  try {
    const { query } = await req.json();
    if (!query) { 
      throw new Error("검색어를 입력해주세요.");
    }

    const accessToken = req.cookies.get("access_token")?.value || "";
    const { id } = await accessVerify(accessToken);

    const seconds = 5;

    const now = moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
    const s5 = moment().tz("Asia/Seoul").subtract(seconds, "seconds").format("YYYY-MM-DD HH:mm:ss");
    const last_request = await collections.last_request();
    const last = await last_request.findOne({ 
      user: id,
      time: {
        $gte: s5,
      },
    });
    if (last) {
      const time = moment(last.time, "YYYY-MM-DD HH:mm:ss");
      const diff = moment.duration(time.diff(moment()));
      const sec = diff.asSeconds();
      throw new Error(`검색은 5초에 한 번만 가능해요. ${seconds + Math.ceil(sec)}초 후에 다시 시도해주세요.`);
    }

    const { results } = await youtubeSearch(query, opts);
    const send = results.map((result) => ({
      id: result.id,
      title: result.title,
    }));

    await last_request.updateOne({
      user: id,
    }, {
      $set: {
        user: id,
        time: now,
      },
    }, {
      upsert: true,
    });
    
    const response = NextResponse.json<YTSearchResponse>({
      success: true,
      data: send,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<YTSearchResponse>({
      success: false,
      // message: e.message,
      error: {
        title: "영상 검색을 실패했어요.",
        description: e.message,
      }
    }, {
      status: 400,
    });
    console.error(e.message);
    return response;
  }
};

export default POST;