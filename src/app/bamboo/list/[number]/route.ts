import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { ErrorMessage } from "@/components/providers/utils";
import { collections } from "@/utils/db";
import { accessVerify } from "@/utils/jwt";

import { BambooResponse } from "./utils";

export const GET = async (
  req: NextRequest,
  { params }: { params: { number: string } }
) => {
  try {
    const { number } = params;
    const numberNatural = isNaN(parseInt(number)) ? 0 : parseInt(number) > 0 ? parseInt(number) : 0;

    const accessToken = req.cookies.get("access_token")?.value || "";
    const { id } = await accessVerify(accessToken);

    const bamboo = await collections.bamboo();
    const bamboos = await bamboo.aggregate<BambooResponse>([
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $skip: 20 * (numberNatural - 1),
      },
      {
        $limit: 20,
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "id",
          as: "userInfo"
        }
      },
      {
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          user: {
            $concat: [
              {
                $cond: {
                  if: { $eq: ["$grade", true] },
                  then: {
                    $concat: [
                      {
                        $toString: {
                          $trunc: {
                            $divide: [{
                              $ifNull: ["$userInfo.number", 0]
                            }, 1000]
                          },
                        }
                      },
                      "학년 "]
                  },
                  else: ""
                }
              },
              {
                $cond: {
                  if: { $eq: ["$anonymous", false] },
                  then: {
                    $ifNull: ["$userInfo.name", "익명"]
                  },
                  else: "익명"
                }
              }
            ]
          },
          title: {
            $ifNull: [
              "$title",
              {
                $concat: [
                  {
                    $substrCP: ["$content", 0, 15],
                  },
                  "..."
                ]
              }
            ],
          },
          // content: "$content",
          goods: {
            $size: {
              $ifNull: ["$good", []]
            }
          },
          bads: {
            $size: {
              $ifNull: ["$bad", []]
            }
          },
          myGood: {
            $in: [id, {
              $ifNull: ["$good", []]
            }]
          },
          myBad: {
            $in: [id, {
              $ifNull: ["$bad", []]
            }]
          },
        }
      },
    ]).toArray();
    
    const response = NextResponse.json<BambooResponse[]>(bamboos);
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
