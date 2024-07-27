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

import { HomecomingResponse } from "./utils";

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
        title: "이런!!",
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