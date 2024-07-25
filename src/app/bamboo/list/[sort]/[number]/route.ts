import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { sortOptionValues } from "@/app/bamboo/sort";
import { ErrorMessage } from "@/components/providers/utils";
import { collections } from "@/utils/db";

import { badsProject, BambooList, BambooResponse, BambooSort, goodsProject, matchQuery, sortQuery, titleProject, userProject } from "./utils";

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

    if (sortOptionValues.indexOf(sort) === -1) { 
      throw new Error("Invalid sort value");
    }

    const bamboo = await collections.bamboo();
    const bambooCount = await bamboo.countDocuments(matchQuery[sort]);
    const bamboos = await bamboo.aggregate<BambooList>([
      {
        $match: matchQuery[sort],
      },
      {
        $lookup: {
          from: "bamboo_comment",
          let: { bambooId: { $toString: "$_id" } }, // localField의 ObjectId를 문자열로 변환
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$document", "$$bambooId"]
                }
              }
            }
          ],
          as: "comments_list"
        }
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
          comments: {
            $size: "$comments_list"
          }
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
          user: userProject,
          title: titleProject,
          timestamp: "$timestamp",
          goods: goodsProject,
          bads: badsProject,
          comments: "$comments",
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
