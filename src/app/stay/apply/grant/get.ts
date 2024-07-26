import { NextRequest, NextResponse } from "next/server";

import { collections } from "@/utils/db";
import { accessVerify } from "@/utils/jwt";

import { StudyroomResponse } from "./utils";

const GET = async (
  req: NextRequest,
) => {
  try {
    const accessToken = req.cookies.get("access_token")?.value || "";
    const { number, gender } = await accessVerify(accessToken);

    const studyroom = await collections.studyroom();
    const myStudyroom = await studyroom.findOne({ 
      grade: Math.floor(number / 1000),
      gender,
    });

    const stay = await collections.stay();
    const stays = await stay.aggregate([
      {
        $match: {
          "seat.onSeat": true
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
      allow: myStudyroom ? myStudyroom.allow : {},
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