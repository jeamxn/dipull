import { NextRequest, NextResponse } from "next/server";

import { getWeekStart } from "@/utils/date";
import { collections } from "@/utils/db";
import { UserInfo } from "@/utils/db/utils";
import { accessVerify } from "@/utils/jwt";
import { getUserByID } from "@/utils/server";

import { StudyroomResponse } from "./utils";

const GET = async (
  req: NextRequest,
  { params }: {
    params: {
      id: UserInfo["id"];
    }
  }
) => {
  try {
    const { target } = await getUserByID(req, params.id, false);
    const { number, gender } = target;

    const studyroom = await collections.studyroom();
    const myStudyroom = await studyroom.find({ 
      grade: Math.floor(number / 1000),
      gender,
    }).toArray();

    const combinedAllow: { [key: string]: Set<number> } = {};
    
    myStudyroom.forEach(doc => {
      for (const key in doc.allow) {
        if (!combinedAllow[key]) {
          combinedAllow[key] = new Set<number>();
        }
        doc.allow[key].forEach(value => {
          combinedAllow[key].add(value);
        });
      }
    });

    // Set을 Array로 변환
    const result: { [key: string]: number[] } = {};
    for (const key in combinedAllow) {
      result[key] = Array.from(combinedAllow[key]);
    }

    const week = await getWeekStart();

    const stay = await collections.stay();
    const stays = await stay.aggregate([
      {
        $match: {
          "seat.onSeat": true,
          week: week
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "id",
          foreignField: "id",
          as: "user_info"
        }
      },
      {
        $unwind: "$user_info"
      },
      {
        $project: {
          _id: 0,
          num: { $substr: ["$seat.num", 1, -1] }, // E4 -> 4
          row: { $substr: ["$seat.num", 0, 1] },  // E4 -> E
          seat_num: "$seat.num",
          user_info: {
            number: "$user_info.number",
            name: "$user_info.name"
          }
        }
      },
      {
        $group: {
          _id: "$row",
          seats: {
            $push: {
              k: "$num",
              v: { $concat: [{ $toString: "$user_info.number" }, " ", "$user_info.name"] }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          row: "$_id",
          seats: {
            $arrayToObject: {
              $map: {
                input: "$seats",
                as: "seat",
                in: {
                  k: "$$seat.k",
                  v: "$$seat.v"
                }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          data: {
            $push: {
              k: "$row",
              v: "$seats"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          result: {
            $arrayToObject: {
              $map: {
                input: "$data",
                as: "item",
                in: {
                  k: "$$item.k",
                  v: "$$item.v"
                }
              }
            }
          }
        }
      }
    ]).toArray();
    

    const response = NextResponse.json<StudyroomResponse>({
      success: true,
      allow: result ? result : {},
      stays: stays[0]?.result || {},
    });

    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<StudyroomResponse>({
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