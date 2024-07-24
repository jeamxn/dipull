import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { ErrorMessage } from "@/components/providers/utils";
import { collections } from "@/utils/db";
import { accessVerify } from "@/utils/jwt";

import { BambooList, BambooResponse, BambooSort } from "./utils";

export const GET = async (
  req: NextRequest,
  { params }: {
    params: {
      number: string,
      sort: BambooSort,
    }
  }
) => {
  try {
    const { number, sort } = params;
    const numberNatural = parseInt(number);
    if (isNaN(numberNatural) || numberNatural < 1) {
      throw new Error("Invalid number value");
    }

    if (["recent", "daily", "weekly", "monthly", "all"].indexOf(sort) === -1) { 
      throw new Error("Invalid sort value");
    }

    const accessToken = req.cookies.get("access_token")?.value || "";
    const { id } = await accessVerify(accessToken);

    const sortQuery = {
      recent: {
        _id: -1,
      },
      daily: {
        popularity: -1,
      },
      weekly: {
        popularity: -1,
      },
      monthly: {
        popularity: -1,
      },
      all: {
        popularity: -1,
      },
    };

    const today = moment().tz("Asia/Seoul");

    const matchQuery = {
      recent: {},
      daily: {
        timestamp: {
          $gte: today.clone().subtract(1, "days").format("YYYY-MM-DD HH:mm:ss"),
        }
      },
      weekly: {
        timestamp: {
          $gte: today.clone().subtract(7, "days").format("YYYY-MM-DD HH:mm:ss"),
        }
      },
      monthly: {
        timestamp: {
          $gte: today.clone().subtract(1, "month").format("YYYY-MM-DD HH:mm:ss"),
        }
      },
      all: {},
    };

    const bamboo = await collections.bamboo();
    const bambooCount = await bamboo.countDocuments(matchQuery[sort]);
    const bamboos = await bamboo.aggregate<BambooList>([
      {
        $match: matchQuery[sort],
      },
      {
        $addFields: {
          popularity: {
            $subtract: [
              {
                $sum: [
                  {
                    $size: {
                      $ifNull: ["$good", []]
                    }
                  },
                  {
                    $size: {
                      $ifNull: ["$comment", []]
                    }
                  }
                ]
              },
              {
                $size: {
                  $ifNull: ["$bad", []]
                }
              }
            ]
          },
        }
      },
      {
        $sort: sortQuery[sort],
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
          id: {
            $toString: "$_id"
          },
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
                    $substrCP: ["$content", 0, 30],
                  },
                  "..."
                ]
              }
            ],
          },
          timestamp: "$timestamp",
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
          comments: {
            $size: {
              $ifNull: ["$comment", []]
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
    
    const response = NextResponse.json<BambooResponse>({
      count: bambooCount,
      list: bamboos,
    });
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
