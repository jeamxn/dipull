import "moment-timezone";
import moment from "moment";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import xss from "xss";


import { getWeekStart } from "@/utils/date";
import { collections } from "@/utils/db";
import { accessVerify } from "@/utils/jwt";

import { Times, times } from "../utils";

import { HomecomingResponse } from "./utils";

const GET = async (
  req: NextRequest,
) => {
  try {
    const accessToken = req.cookies.get("access_token")?.value || "";
    const { id } = await accessVerify(accessToken);

    const week = await getWeekStart();

    const homecoming = await collections.homecoming();
    const myHomecoming = await homecoming.findOne({
      id: id,
      week: week,
    });
    
    const response = NextResponse.json<HomecomingResponse>({
      success: true,
      data: myHomecoming ? {
        week: myHomecoming.week,
        id: myHomecoming.id,
        reason: myHomecoming.reason,
        time: myHomecoming.time,
      } : {
        week: week,
        id: id,
        reason: "",
        time: "school",
      },
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<HomecomingResponse>({
      success: false,
      error: {
        title: "금요귀가 신청을 불러오는 중 오류가 발생했습니다.",
        description: e.message,
      }
    }, {
      status: 400,
    });
    console.error(e.message);
    return response;
  }
};

export default GET;