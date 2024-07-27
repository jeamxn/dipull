import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { getWeekStart } from "@/utils/date";
import { collections } from "@/utils/db";
import { Stay, UserInfo } from "@/utils/db/utils";

import { KeyStay, KeyStayResponse } from "./utils";

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

    const stay = await collections.stay();
    const myStay = await stay.aggregate<KeyStay>([
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
        $lookup: {
          from: "outing",
          localField: "id",
          foreignField: "id",
          as: "outing",
        },
      },
      {
        $unwind: "$outing",
      },
      {
        $project: {
          _id: 0,
          id: "$id",
          name: "$user.name",
          number: "$user.number",
          gender: "$user.gender",
          seat: {
            $ifNull: ["$seat.num", "$seat.reason"],
          },
          week: "$week",
          saturday: {
            meal: "$outing.meals.saturday",
            outing: "$outing.outing.saturday",
          },
          sunday: {
            meal: "$outing.meals.sunday",
            outing: "$outing.outing.sunday",
          },
        },
      },
    ]).toArray();

    const response = NextResponse.json<KeyStayResponse>({
      success: true,
      data: myStay,
    });

    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<KeyStayResponse>({
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