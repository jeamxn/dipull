import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { collections } from "@/utils/db";
import { accessVerify } from "@/utils/jwt";

import { WakeupPutResponse } from "./utils";

const DELETE = async (
  req: NextRequest,
) => {
  try {
    const { _id } = await req.json();
    if (!_id) {
      throw new Error("빈칸을 모두 채워주세요.");
    }

    const objectId = ObjectId.createFromHexString(_id);
    const accessToken = req.cookies.get("access_token")?.value || "";
    const { id } = await accessVerify(accessToken);

    const wakeup = await collections.wakeup();
    const deleteApply = await wakeup.deleteOne({ _id: objectId, owner: id });

    if (deleteApply.deletedCount === 0) { 
      throw new Error("이미 삭제된 신청곡입니다.");
    }
    
    const response = NextResponse.json<WakeupPutResponse>({
      success: true,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<WakeupPutResponse>({
      success: false,
      error: {
        title: "신청곡 삭제에 실패했어요.",
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