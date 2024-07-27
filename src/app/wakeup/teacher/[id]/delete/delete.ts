import "moment-timezone";
import moment from "moment";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { collections } from "@/utils/db";
import { Wakeup } from "@/utils/db/utils";
import { accessVerify } from "@/utils/jwt";

import { WakeupDeleteResponse } from "./utils";

const DELETE = async (
  req: NextRequest,
  { params }: {
    params: {
      id: Wakeup["video"];
    }
  }
) => {
  try {
    const wakeup = await collections.wakeup();
    const deleteBamboo = await wakeup.deleteMany({
      video: params.id
    });

    if (deleteBamboo.deletedCount === 0) {
      throw new Error("기상송 신청을 삭제할 수 없습니다.");
    }

    const response = NextResponse.json<WakeupDeleteResponse>({
      success: true,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<WakeupDeleteResponse>({
      success: false,
      error: {
        title: "기상송 신청을 삭제하는 중 오류가 발생했습니다.",
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