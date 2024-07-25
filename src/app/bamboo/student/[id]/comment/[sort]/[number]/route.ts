import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { badsProject, BambooSort, goodsProject, isWriterProject, matchQuery, profile_imageProject, sortQuery, userProject } from "@/app/bamboo/list/[sort]/[number]/utils";
import { sortOptionValues } from "@/app/bamboo/sort";
import { ErrorMessage } from "@/components/providers/utils";
import { collections } from "@/utils/db";
import { accessVerify } from "@/utils/jwt";

import { BambooRead } from "../../../utils";

import { BambooCommentList, BambooCommentResponse } from "./utils";

export const GET = async (
  req: NextRequest,
  { params }: {
    params: {
      id: BambooRead["id"];
      number: string;
      sort: BambooSort;
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

    const accessToken = req.cookies.get("access_token")?.value || "";
    const { id } = await accessVerify(accessToken);

    const bambooComment = await collections.bamboo_comment();
    const bambooCommentCount = await bambooComment.countDocuments({
      document: params.id,
      ...matchQuery[sort],
    });
    const bambooComments = await bambooComment.aggregate<BambooCommentList>([
      {
        $match: {
          document: params.id,
          ...matchQuery[sort],
        },
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
          user: userProject,
          timestamp: "$timestamp",
          text: "$text",
          goods: goodsProject,
          bads: badsProject,
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
          isWriter: isWriterProject(id),
          profile_image: profile_imageProject,
        }
      },
    ]).toArray();
    
    const response = NextResponse.json<BambooCommentResponse>({
      count: bambooCommentCount,
      list: bambooComments,
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
