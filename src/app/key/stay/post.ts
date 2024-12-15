import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { getWeekStart } from "@/utils/date";
import { collections } from "@/utils/db";
import { Stay, UserInfo } from "@/utils/db/utils";

import { KeyStay, KeyStayResponse } from "./utils";

const POST = async (
  req: NextRequest,
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
          let: { id: "$id", week: "$week" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$id", "$$id"] },
                    { $eq: ["$week", "$$week"] },
                  ],
                },
              },
            },
          ],
          as: "outing",
        },
      },
      {
        $unwind: "$outing",
        preserveNullAndEmptyArrays: true,
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
            meal: {
              $ifNull: ["$outing.meals.saturday", { breakfast: true, lunch: true, dinner: true }],
            },
            outing: {
              $ifNull: ["$outing.outing.saturday", []],
            },
          },
          sunday: {
            meal: {
              $ifNull: ["$outing.meals.sunday", { breakfast: true, lunch: true, dinner: true }],
            },
            outing: {
              $ifNull: ["$outing.outing.sunday", []],
            },
          },
        },
      },
    ]).toArray();

    const object: {
      [key: string]: {
        [key: string]: KeyStay[];
      }
    } = {};
    myStay.forEach((stay) => { 
      const grade = Math.floor(stay.number / 1000);
      const classNum = Math.floor(stay.number / 100) % 10;
      object[grade] = object[grade] || {};
      object[grade][classNum] = object[grade][classNum] || [];
      const hasUserStay = object[grade][classNum].findIndex((user) => user.id === stay.id);
      if (hasUserStay !== -1) {
        object[grade][classNum][hasUserStay] = stay;
        return;
      }
      else {
        object[grade][classNum].push(stay);
        return;
      }
    });

    const response = NextResponse.json<KeyStayResponse>({
      success: true,
      data: object,
      query: {
        week
      }
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

export default POST;