import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { MachineApplyResponse } from "@/app/machine/[type]/grant/apply/utils";
import { MachineType, machineTypeToKorean } from "@/app/machine/[type]/utils";
import { collections } from "@/utils/db";
import { UserInfo } from "@/utils/db/utils";
import { accessVerify } from "@/utils/jwt";

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
    if (!params.type) {
      throw new Error("예약할 기기를 선택해주세요.");
    }
    if (params.type !== "washer" && params.type !== "dryer") { 
      throw new Error("올바르지 않은 기기입니다.");
    }
    if (!params.id) {
      throw new Error("예약할 학생을 선택해주세요.");
    }

    const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");

    const user = await collections.users();
    const getUser = await user.findOne({
      id: params.id,
    });
    if (!getUser) {
      throw new Error("존재하지 않는 학생입니다.");
    }
    const { id, gender, number } = getUser;

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