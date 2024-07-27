import "moment-timezone";
import moment from "moment";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import xss from "xss";

import { getWeekStart, isApplyAvail, stayApplyErrorMessage } from "@/utils/date";
import { collections } from "@/utils/db";
import { UserInfo } from "@/utils/db/utils";
import { accessVerify } from "@/utils/jwt";

import { HomecomingResponse } from "../../student/utils";
import { Times, times } from "../../utils";

const PUT = async (
  req: NextRequest,
  { params }: {
    params: {
      id: UserInfo["id"];
    }
  }
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

    if (!params.id) {
      throw new Error("학생을 선택해주세요.");
    }
    const user = await collections.users();
    const getUser = await user.findOne({
      id: params.id,
      type: "student"
    });
    if (!getUser) {
      throw new Error("존재하지 않는 학생입니다.");
    }
    const { id, gender, number } = getUser;
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