import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { getWeekStart } from "@/utils/date";
import { collections } from "@/utils/db";
import { Stay, UserInfo } from "@/utils/db/utils";

import { KeyHomecoming, KeyHomecomingResponse } from "./utils";

const GET = async (
  req: NextRequest,
  { params }: {
    params: {
      id: UserInfo["id"];
    }
  }
) => {
  try {
    const week = await getWeekStart();

    const stay = await collections.homecoming();
    const myStay = await stay.aggregate<KeyHomecoming>([
      {
        $match: {
          week: week,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "id",
          foreignField: "id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          id: "$id",
          name: "$user.name",
          number: "$user.number",
          gender: "$user.gender",
          week: "$week",
          reason: "$reason",
          time: "$time",
        },
      },
    ]).toArray();

    const response = NextResponse.json<KeyHomecomingResponse>({
      success: true,
      data: myStay,
    });

    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<KeyHomecomingResponse>({
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