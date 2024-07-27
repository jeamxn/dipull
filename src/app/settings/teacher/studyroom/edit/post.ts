import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { collections } from "@/utils/db";
import { Studyroom } from "@/utils/db/utils";

import { StudyroomAllResponse } from "./utils";

const POST = async (
  req: NextRequest,
) => {
  try {
    const { studyroomData }: {
      studyroomData: Studyroom[];
    } = await req.json();
    if (!studyroomData) {
      throw new Error("빈칸을 모두 채워주세요.");
    }

    const collection = await collections.studyroom();
    await collection.deleteMany({});
    await collection.insertMany(studyroomData);

    const response = NextResponse.json<StudyroomAllResponse>({
      success: true,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<StudyroomAllResponse>({
      success: false,
      error: {
        title: "열람실 좌석 정보 수정에 실패했어요.",
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