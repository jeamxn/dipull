import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { ErrorMessage } from "@/components/providers/utils";
import { checkWeekend } from "@/utils/date";
import { collections } from "@/utils/db";
import { Machine_list } from "@/utils/db/utils";

import { MachineType } from "../../utils";

import { Machine_list_Response } from "./utils";

export const GET = async (
  req: NextRequest,
  { params }: { params: { type: MachineType, allow: string } }
) => {
  try {
    const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    const isWeekend = await checkWeekend(today);
    const washer_list = await collections.machine_list();
    const getAll = await washer_list.aggregate<Machine_list_Response>([
      {
        $match: {
          type: params.type,
        },
      },
      {
        $project: {
          code: { $toString: "$_id" },
          _id: 0,
          type: "$type",
          name: "$name",
          gender: "$gender",
          allow: params.allow === "teacher" ? "$allow.default" : isWeekend ? "$allow.weekend" : "$allow.default",
        }
      },
      {
        $sort: {
          code: 1,
        },
      },
    ]).toArray();
    const response = NextResponse.json<Machine_list_Response[]>(getAll);
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<{
      error: ErrorMessage;
    }>({
      error: {
        title: "목록 조회를 실패했어요.",
        description: e.message,
      },
    }, {
      status: 400,
    });
    console.error(e.message);
    return response;
  }
  
};
