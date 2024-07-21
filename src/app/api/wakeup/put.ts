import axios from "axios";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { YouTubeSearchResults } from "youtube-search";

import { getApplyStartDate } from "@/app/api/stay/utils";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";


import { getWakeupAvail } from "./apply/server";
import { WakeupData, WakeupNobat, getToday } from "./utils";

const PUT = async (
  req: Request,
) => {
  // 헤더 설정
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
  
  // Authorization 헤더 확인
  const authorization = headers().get("authorization");
  const accessToken = authorization?.split(" ")[1] || "";
  const verified = await verify(accessToken);
  if(!verified.ok || !verified.payload?.id || !verified.payload?.data.id) return new NextResponse(JSON.stringify({
    message: "로그인이 필요합니다.",
  }), {
    status: 401,
    headers: new_headers
  });

  const json = await req.json();
  const bat = json.bat;
  if(!bat) return new NextResponse(JSON.stringify({
    message: "잘못된 요청입니다.",
  }), {
    status: 400,
    headers: new_headers
  });
  const batInt = parseInt(bat);
  if(isNaN(batInt) || batInt <= 0) return new NextResponse(JSON.stringify({
    message: "1개 이상 신청 해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  const select: YouTubeSearchResults = json.data;
  if(!select.id) return new NextResponse(JSON.stringify({ 
    message: "페이로드 불일치.",
  }), {
    status: 400,
    headers: new_headers
  });

  const client = await connectToDatabase();
  const wakeupCollection = client.db().collection("wakeup");
  const wakeupAplyCollection = client.db().collection("wakeup_aply");

  const myAvail = await getWakeupAvail(verified.payload.id);
  if(myAvail.available <= 0) return new NextResponse(JSON.stringify({
    message: "신청 가능한 신청권이 없습니다.",
    ok: false,
  }), {
    status: 400,
    headers: new_headers
  });

  try {
    const url = "https://www.youtube.com/oembed"; 
    const params = { "format": "json", "url": `https://www.youtube.com/watch?v=${select.id}` };
    const res = await axios.get(url, {
      params,
    });
    const week = await getApplyStartDate();
    const putData: WakeupNobat = {
      title: res.data.title,
      id: select.id,
      owner: verified.payload.data.id,
      gender: verified.payload.data.gender,
      week: week,
    };
    await wakeupAplyCollection.findOneAndUpdate({
      owner: verified.payload.id,
      // date: week,
    }, {
      $inc: {
        available: -batInt,
      }
    });
    const add = await wakeupCollection.updateOne({
      week: week,
      owner: verified.payload.data.id,
      id: select.id,
    }, {
      $set: putData,
      $inc: {
        bat: batInt,
      }
    }, {
      upsert: true,
    });
    const myAvail = await getWakeupAvail(verified.payload.id);
    if ((myAvail.available + batInt) <= 0) {
      await wakeupCollection.updateOne({
        week: week,
        owner: verified.payload.data.id,
        id: select.id,
      }, {
        $set: putData,
        $inc: {
          bat: -batInt,
        }
      });
      return new NextResponse(JSON.stringify({
        message: "신청 가능한 신청권이 없습니다.",
        ok: false,
      }), {
        status: 400,
        headers: new_headers
      });
    }
    else if(add) {
      return new NextResponse(JSON.stringify({
        message: "성공적으로 추가되었습니다.",
        ok: true,
      }), {
        status: 200,
        headers: new_headers
      });
    }
    else {
      return new NextResponse(JSON.stringify({
        message: "오류가 발생했습니다.",
        ok: false,
      }), {
        status: 500,
        headers: new_headers
      });
    }
  }
  catch (e: any) {
    if (e.response.data.type !== "video") return new NextResponse(JSON.stringify({
      message: "동영상만 추가할 수 있습니다.",
      ok: false,
    }), {
      status: 400,
      headers: new_headers
    });
    return new NextResponse(JSON.stringify({
      message: e.message,
      ok: false,
    }), {
      status: 500,
      headers: new_headers
    });
  }
};

export default PUT;