import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { getWeekStart } from "@/utils/date";
import { collections } from "@/utils/db";
import { Wakeup } from "@/utils/db/utils";
import { accessVerify } from "@/utils/jwt";

import { MyWakeupResponse } from "./utils";

const POST = async (
  req: NextRequest,
) => {
  try {
    const accessToken = req.cookies.get("access_token")?.value || "";
    const { id } = await accessVerify(accessToken);

    const week = await getWeekStart();
    const wakeup = await collections.wakeup();
    const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    const myQuery = {
      owner: id,
      date: today,
      week: week,
    };
    const myWakeup = await wakeup.find(myQuery).toArray();

    const response = NextResponse.json<MyWakeupResponse>({
      success: true,
      data: myWakeup,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<MyWakeupResponse>({
      success: false,
      error: {
        title: "내 기상송 조회를 실패했어요.",
        description: e.message,
      }
    }, {
      status: 400,
    });
    console.error(e.message);
    return response;
  }
};

export default POST;