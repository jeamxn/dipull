import "moment-timezone";
import axios from "axios";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { getWeekStart } from "@/utils/date";
import { collections } from "@/utils/db";
import { Wakeup } from "@/utils/db/utils";
import { accessVerify } from "@/utils/jwt";

import { WakeupPutResponse } from "./utils";

const PUT = async (
  req: NextRequest,
) => {
  try {
    const { id: video_id } = await req.json();
    if (!video_id) {
      throw new Error("빈칸을 모두 채워주세요.");
    }
    const accessToken = req.cookies.get("access_token")?.value || "";
    const { id } = await accessVerify(accessToken);

    const wakeup = await collections.wakeup();
    const week = await getWeekStart();
    const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    const myQuery = {
      owner: id,
      date: today,
      week: week,
    };
    const myWakeup = await wakeup.countDocuments(myQuery);
    if (myWakeup >= 3) {
      throw new Error("하루에 최대 3개의 기상송만 투표할 수 있습니다.");
    }

    const url = "https://www.youtube.com/oembed"; 
    const params = { "format": "json", "url": `https://www.youtube.com/watch?v=${video_id}` };
    const res = await axios.get(url, {
      params,
    });
    const putData: Wakeup = {
      title: res.data.title,
      video: video_id,
      owner: id,
      week: week,
      date: today,
    };
    const insert = await wakeup.insertOne(putData);

    const myWakeup2 = await wakeup.countDocuments(myQuery);
    if (myWakeup2 >= 4) {
      await wakeup.deleteOne({ _id: insert.insertedId });
      throw new Error("하루에 최대 3개의 기상송만 투표할 수 있습니다.");
    }

    const response = NextResponse.json<WakeupPutResponse>({
      success: true,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<WakeupPutResponse>({
      success: false,
      error: {
        title: "기상송 투표에 실패했어요.",
        description: e.message,
      }
    }, {
      status: 400,
    });
    return response;
  }
};

export default PUT;