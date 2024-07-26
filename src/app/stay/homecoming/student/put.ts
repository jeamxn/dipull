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

const PUT = async (
  req: NextRequest,
) => {
  try {
    const { reason, time } = await req.json();
    if (typeof reason !== "string" || typeof time !== "string") {
      throw new Error("올바르지 않은 요청입니다.");
    }
    else if (reason.length < 1 || reason.length > 100) {
      throw new Error("사유는 1자 이상 100자 이하여야 합니다.");
    }
    else if (times.indexOf(time as any) === -1) { 
      throw new Error("올바르지 않은 시간입니다.");
    }

    const accessToken = req.cookies.get("access_token")?.value || "";
    const { id, number } = await accessVerify(accessToken);
    if (number < 3000) {
      throw new Error("3학년만 금요귀가 신청을 할 수 있습니다.");
    }

    const week = await getWeekStart();

    const homecoming = await collections.homecoming();
    const myHomecomingCount = await homecoming.countDocuments({
      id: id,
      week: week,
    });
    if (myHomecomingCount >= 1) {
      throw new Error("이미 금요귀가 신청을 하셨습니다.");
    }

    const put = await homecoming.insertOne({
      week: week,
      id: id,
      reason: xss(reason),
      time: time as Times,
    });
    if (!put.insertedId) {
      throw new Error("금요귀가 신청을 하는 중 오류가 발생했습니다.");
    }
    
    const response = NextResponse.json<HomecomingResponse>({
      success: true,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<HomecomingResponse>({
      success: false,
      error: {
        title: "이럴수가...!",
        description: e.message,
      }
    }, {
      status: 400,
    });
    console.error(e.message);
    return response;
  }
};

export default PUT;