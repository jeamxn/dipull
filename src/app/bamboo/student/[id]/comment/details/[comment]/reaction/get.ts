import "moment-timezone";
import moment from "moment";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { badsProject, goodsProject } from "@/app/bamboo/list/[sort]/[number]/utils";
import { ErrorMessage } from "@/components/providers/utils";
import { collections } from "@/utils/db";
import { Bamboo } from "@/utils/db/utils";
import { accessVerify } from "@/utils/jwt";

import { BambooRead } from "../../../../utils";

import { BambooCommentReact } from "./utils";

const GET = async (
  req: NextRequest,
  { params }: {
    params: {
      id: BambooRead["id"];
      comment: string;
    }
  }
) => {
  try {
    const accessToken = req.cookies.get("access_token")?.value || "";
    const { id } = await accessVerify(accessToken);

    const bambooDB = await collections.bamboo_comment();
    const getReaction = await bambooDB.aggregate<BambooCommentReact>([
      {
        $match: {
          // _id: ObjectId.createFromHexString(params.id)
          _id: ObjectId.createFromHexString(params.comment),
          document: params.id,
        }
      },
      {
        $project: {
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
        }
      }
    ]).toArray();
    const reaction = getReaction[0];

    const response = NextResponse.json<BambooCommentReact>(reaction);
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<{
      error: ErrorMessage;
    }>({
      error: {
        title: "공감 반응을 불러오는 중 오류가 발생했습니다.",
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