import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { ErrorMessage } from "@/components/providers/utils";
import { checkWeekend } from "@/utils/date";

import { MachineType } from "../utils";

export const GET = async (
  req: NextRequest,
  { params }: { params: { type: MachineType } }
) => {
  try {
    const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    const isWeekend = await checkWeekend(today);
    
    const washer = {
      default: [
        "18:35",
        "19:35",
        "20:30",
        "21:30",
        "22:30",
      ],
      weekend: [
        "12:00",
        "13:00",
        "18:35",
        "19:35",
        "20:30",
        "21:30",
        "22:30",
      ],
    };
    const dryer = {
      default: [
        "19:35",
        "21:30",
      ],
      weekend: [
        "13:00",
        "19:35",
        "21:30",
      ],
    };
    const type = params.type === "washer" ? washer : dryer;
    const list = type[isWeekend ? "weekend" : "default"];
  
    const response = NextResponse.json(list);
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<{
      error: ErrorMessage;
    }>({
      error: {
        title: "시간 조회를 실패했어요.",
        description: e.message,
      },
    }, {
      status: 400,
    });
    console.error(e.message);
    return response;
  }
  
};
