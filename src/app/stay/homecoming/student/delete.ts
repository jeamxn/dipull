import "moment-timezone";
import moment from "moment";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import xss from "xss";


import { getWeekStart, isApplyEnd, stayApplyErrorMessage } from "@/utils/date";
import { collections } from "@/utils/db";
import { accessVerify } from "@/utils/jwt";

import { Times, times } from "../utils";

import { HomecomingResponse } from "./utils";

const DELETE = async (
  req: NextRequest,
) => {
  try {
    const accessToken = req.cookies.get("access_token")?.value || "";
    const { id, number } = await accessVerify(accessToken);
    if (await isApplyEnd(number)) {
      throw new Error(stayApplyErrorMessage(number));
    }

    const week = await getWeekStart();

    const homecoming = await collections.homecoming();
    const deleteMy = await homecoming.deleteOne({
      id: id,
      week: week,
    });
    if (deleteMy.deletedCount === 0) { 
      throw new Error("금요귀가 신청이 존재하지 않습니다.");
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
        title: "어라라?",
        description: e.message,
      }
    }, {
      status: 400,
    });
    console.error(e.message);
    return response;
  }
};

export default DELETE;