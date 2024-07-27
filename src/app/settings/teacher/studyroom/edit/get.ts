import { NextRequest, NextResponse } from "next/server";

import { collections } from "@/utils/db";
import { Studyroom, UserInfo } from "@/utils/db/utils";
import { accessVerify } from "@/utils/jwt";
import { getUserByID } from "@/utils/server";

import { StudyroomAllResponse } from "./utils";

const GET = async (
  req: NextRequest,
) => {
  try {
    const studyroom = await collections.studyroom();
    const myStudyroom = await studyroom.aggregate<Studyroom>([
      {
        $unset: ["_id"],
      }
    ]).toArray();

    const response = NextResponse.json<StudyroomAllResponse>({
      success: true,
      data: myStudyroom,
    });

    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<StudyroomAllResponse>({
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