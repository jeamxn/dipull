import "moment-timezone";
import moment from "moment";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { collections } from "@/utils/db";
import { BambooComment } from "@/utils/db/utils";
import { accessVerify } from "@/utils/jwt";

import { BambooRead } from "../../../../utils";

import { BambooCommentDeleteResponse } from "./utils";

const DELETE = async (
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

    const bambooCommentDB = await collections.bamboo_comment();
    const deleteBamboo = await bambooCommentDB.deleteOne({
      _id: ObjectId.createFromHexString(params.comment),
      document: params.id,
      user: id,
    });

    if (deleteBamboo.deletedCount === 0) {
      throw new Error("댓글을 삭제할 수 없습니다.");
    }

    const response = NextResponse.json<BambooCommentDeleteResponse>({
      success: true,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<BambooCommentDeleteResponse>({
      success: false,
      error: {
        title: "댓글을 삭제하는 중 오류가 발생했습니다.",
        description: e.message,
      }
    }, {
      status: 400,
    });
    console.error(e.message);
    return response;
  }
};

export default DELETE;