import "moment-timezone";
import moment from "moment";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import xss from "xss";


import { getWeekStart } from "@/utils/date";
import { collections } from "@/utils/db";
import { accessVerify } from "@/utils/jwt";

import { StayResponse } from "./utils";

const DELETE = async (
  req: NextRequest,
) => {
  try {
    const accessToken = req.cookies.get("access_token")?.value || "";
    const { id } = await accessVerify(accessToken);

    const week = await getWeekStart();

    const stay = await collections.stay();
    const deleteMy = await stay.deleteOne({
      id: id,
      week: week,
    });
    if (deleteMy.deletedCount === 0) { 
      throw new Error("잔류 신청이 존재하지 않습니다.");
    }
    
    const response = NextResponse.json<StayResponse>({
      success: true,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<StayResponse>({
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