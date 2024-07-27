import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { ErrorMessage } from "@/components/providers/utils";
import { checkWeekend } from "@/utils/date";
import { collections } from "@/utils/db";
import { Machine_Time } from "@/utils/db/utils";

import { MachineType } from "../../utils";

import { TimesResponse } from "./utils";

export const GET = async (
  req: NextRequest,
  { params }: { params: { type: MachineType } }
) => {
  try {
    const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");

    const machine_time = await collections.machine_time();
    const [default_, weekend] = await Promise.all([
      machine_time.findOne({
        type: params.type,
        when: "default",
      }),
      machine_time.findOne({
        type: params.type,
        when: "weekend",
      })
    ]);
  
    const response = NextResponse.json<TimesResponse>({
      data: {
        default: default_?.time || [],
        weekend: weekend?.time || [],
      }
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<TimesResponse>({
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
