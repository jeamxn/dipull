import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { checkWeekend } from "@/utils/date";
import { collections } from "@/utils/db";
import { Machine_list, Machine_list_Response } from "@/utils/db/utils";

import { MachineType } from "../utils";

export const GET = async (
  req: NextRequest,
  { params }: { params: { type: MachineType } }
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
          _id: 0,
          type: "$type",
          code: "$code",
          name: "$name",
          gender: "$gender",
          allow: isWeekend ? "$allow.weekend" : "$allow.default",
        }
      }
    ]).toArray();
    const response = NextResponse.json(getAll);
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json({
      message: e.message,
    }, {
      status: 401,
    });
    console.error(e.message);
    return response;
  }
  
};
