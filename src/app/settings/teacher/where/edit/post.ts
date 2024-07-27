import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { collections } from "@/utils/db";
import { Studyroom } from "@/utils/db/utils";

import { ToEditResponse } from "./utils";

const POST = async (
  req: NextRequest,
) => {
  try {
    const { grade } = await req.json();
    if (!grade) {
      throw new Error("빈칸을 모두 채워주세요.");
    }
    if (grade !== 1 && grade !== 2 && grade !== 3) { 
      throw new Error("학년은 1, 2, 3 중 하나여야 합니다.");
    }

    const usersDB = await collections.users();
    const users = (await usersDB.find({ 
      number: {
        $gt: Number(grade) * 1000,
        $lt: (Number(grade) + 1) * 1000,
      }
    }).toArray()).map((user) => user.id);

    const stayDB = await collections.stay();
    const updated = await stayDB.updateMany({
      id: { $in: users },
    }, {
      $set: {
        seat: {
          onSeat: false,
          reason: "교실 잔류"
        }
      }
    });

    if (updated.modifiedCount === 0) {
      throw new Error("수정된 학생이 없습니다.");
    }

    const response = NextResponse.json<ToEditResponse>({
      success: true,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<ToEditResponse>({
      success: false,
      error: {
        title: "수정 중 오류가 발생했어요.",
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