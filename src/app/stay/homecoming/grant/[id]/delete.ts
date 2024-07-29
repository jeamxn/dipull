import "moment-timezone";
import moment from "moment";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import xss from "xss";


import { getWeekStart, isApplyAvail, stayApplyErrorMessage } from "@/utils/date";
import { collections } from "@/utils/db";
import { UserInfo } from "@/utils/db/utils";
import { accessVerify } from "@/utils/jwt";
import { getUserByID } from "@/utils/server";

import { HomecomingResponse } from "./utils";

const DELETE = async (
  req: NextRequest,
  { params }: {
    params: {
      id: UserInfo["id"];
    }
  }
) => {
  try {
    const { target, isTeacher } = await getUserByID(req, params.id);
    const { id, number } = target;

    const applyStart = await isApplyAvail(number, "homecoming");
    if (!applyStart && !isTeacher) {
      throw new Error(await stayApplyErrorMessage(number, "homecoming"));
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