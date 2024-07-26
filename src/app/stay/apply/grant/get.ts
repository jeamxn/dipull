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

    if (!myStudyroom) {
      return NextResponse.json<StudyroomResponse>({
        success: true,
        allow: {},
      });
    }

    const response = NextResponse.json<StudyroomResponse>({
      success: true,
      allow: myStudyroom.allow,
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