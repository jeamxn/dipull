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

const DELETE = async (
  req: NextRequest,
  { params }: {
    params: {
      id: UserInfo["id"];
    }
  }
) => {
  try {
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