import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { collections } from "@/utils/db";
import { accessVerify } from "@/utils/jwt";

import { MachineType, machineTypeToKorean } from "../../utils";

import { MachineApplyResponse } from "./utils";

const DELETE = async (
  req: NextRequest,
  { params }: {
    params: {
      type: MachineType
    }
  }
) => {
  try {
    const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");

    const accessToken = req.cookies.get("access_token")?.value || "";
    const { id } = await accessVerify(accessToken);

    const machineDB = await collections.machine();
    const machineData = await machineDB.deleteOne({
      type: params.type,
      owner: id,
      date: today,
    });
    if (!machineData.deletedCount) { 
      throw new Error(`예약된 ${machineTypeToKorean(params.type)}가 없습니다.`);
    }

    const response = NextResponse.json<MachineApplyResponse>({
      success: true,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<MachineApplyResponse>({
      success: false,
      error: {
        title: "예약 취소를 실패했어요.",
        description: e.message,
      },
    }, {
      status: 400,
    });
    console.error(e.message);
    return response;
  }
};

export default DELETE;