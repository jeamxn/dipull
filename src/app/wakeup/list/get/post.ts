import { NextRequest, NextResponse } from "next/server";

import { getWeekStart } from "@/utils/date";
import { collections } from "@/utils/db";

import { WakeupListData, WakeupListResponse } from "./utlis";

const POST = async (
  req: NextRequest,
) => {
  try {
    const wakeup = await collections.wakeup();
    const week = await getWeekStart();
    const getAll = await wakeup.aggregate<WakeupListData>([
      {
        $match: {
          week,
        },
      },
      {
        $group: {
          _id: "$video",
          title: { $last: "$title" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
          _id: -1,
        },
      },
    ]).toArray();

    const response = NextResponse.json<WakeupListResponse>({
      success: true,
      data: getAll,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<WakeupListResponse>({
      success: false,
      error: {
        title: "기상송 목록을 불러오는데 실패했어요.",
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