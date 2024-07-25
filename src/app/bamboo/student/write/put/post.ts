import "moment-timezone";
import moment from "moment";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import xss from "xss";

import { collections } from "@/utils/db";
import { accessVerify } from "@/utils/jwt";

import { BambooWriteResponse } from "./utils";

const POST = async (
  req: NextRequest,
) => {
  try {
    const { title, content, grade, anonymous } = await req.json();
    if (typeof title !== "string" || typeof content !== "string" || typeof grade !== "boolean" || typeof anonymous !== "boolean") {
      throw new Error("Invalid body value");
    }
    if (title.length < 1 || title.length > 30) { 
      throw new Error("제목은 1자 이상 30자 이하여야 합니다.");
    }
    if (content.length < 1 || content.length > 5000) {
      throw new Error("내용은 1자 이상 5,000자 이하여야 합니다");
    }
    const xss_title = xss(title);
    const xss_content = xss(content);

    const accessToken = req.cookies.get("access_token")?.value || "";
    const { id } = await accessVerify(accessToken);
    const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");

    const bambooDB = await collections.bamboo();
    const insert = await bambooDB.insertOne({
      user: id,
      title: xss_title,
      content: xss_content,
      grade,
      anonymous,
      timestamp: today,
      good: [],
      bad: [],
    });
    if (!insert.insertedId) {
      throw new Error("대나무 등록에 실패했습니다.");
    }

    const response = NextResponse.json<BambooWriteResponse>({
      success: true,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<BambooWriteResponse>({
      success: false,
      error: {
        title: "대나무를 등록하는 중 오류가 발생했습니다.",
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