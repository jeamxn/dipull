import "moment-timezone";
import moment from "moment";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import xss from "xss";

import { getWeekStart } from "@/utils/date";
import { collections } from "@/utils/db";
import { UserInfo } from "@/utils/db/utils";
import { accessVerify } from "@/utils/jwt";
import { getUserByID } from "@/utils/server";

import { initialMeals } from "../../utils";

import { initailOutingResponse, OutingResponse } from "./utils";

const GET = async (
  req: NextRequest,
  { params }: {
    params: {
      id: UserInfo["id"];
    }
  }
) => {
  try {
    const { target } = await getUserByID(req, params.id);
    const { id } = target;

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