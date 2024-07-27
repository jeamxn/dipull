import "moment-timezone";
import moment from "moment";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import xss from "xss";

import { getWeekStart } from "@/utils/date";
import { collections } from "@/utils/db";
import { UserInfo } from "@/utils/db/utils";
import { accessVerify } from "@/utils/jwt";

import { initailOutingResponse, OutingResponse } from "../../student/utils";
import { initialMeals } from "../../utils";

const GET = async (
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

    const outingDB = await collections.outing();
    const outing = await outingDB.findOne({
      id: id,
      week: week,
    });
    
    const response = NextResponse.json<OutingResponse>({
      success: true,
      outing: outing?.outing || initailOutingResponse,
      meals: outing?.meals || initialMeals,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<OutingResponse>({
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

export default GET;