import "moment-timezone";
import moment from "moment";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import xss from "xss";

import { collections } from "@/utils/db";
import { accessVerify } from "@/utils/jwt";

import { BambooRead } from "../../utils";

import { BambooCommentWriteResponse } from "./utils";

const POST = async (
  req: NextRequest,
  { params }: {
    params: {
      id: BambooRead["id"];
    }
  }
) => {
  try {
    const { text, grade, anonymous } = await req.json();
    if (typeof text !== "string" || typeof grade !== "boolean" || typeof anonymous !== "boolean") {
      throw new Error("Invalid body value");
    }
    if (text.length < 1 || text.length > 5000) {
      throw new Error("내용은 1자 이상 1,000자 이하여야 합니다");
    }
    const xss_text = xss(text);

    const accessToken = req.cookies.get("access_token")?.value || "";
    const { id } = await accessVerify(accessToken);
    const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");

    const bambooDB = await collections.bamboo_comment();
    const insert = await bambooDB.insertOne({
      document: params.id,
      user: id,
      text: xss_text,
      grade,
      anonymous,
      timestamp: today,
      good: [],
      bad: [],
    });
    if (!insert.insertedId) {
      throw new Error("댓글 등록에 실패했습니다.");
    }
    const response = NextResponse.json<BambooCommentWriteResponse>({
      success: true,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<BambooCommentWriteResponse>({
      success: false,
      error: {
        title: "댓글을 등록하는 중 오류가 발생했습니다.",
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