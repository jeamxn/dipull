import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { collections } from "@/utils/db";
import { UserInfo } from "@/utils/db/utils";
import { accessVerify } from "@/utils/jwt";
import { getUserByID } from "@/utils/server";

import { MachineType, machineTypeToKorean } from "../../../utils";

import { MachineApplyResponse } from "./utils";

const DELETE = async (
  req: NextRequest,
  { params }: {
    params: {
      type: MachineType;
      id: UserInfo["id"];
    }
  }
) => {
  try {
    const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");

    const { target } = await getUserByID(req, params.id);
    const { id } = target;

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