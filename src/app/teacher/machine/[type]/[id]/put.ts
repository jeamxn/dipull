import "moment-timezone";
import moment from "moment";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { MachineApplyResponse } from "@/app/machine/[type]/grant/apply/utils";
import { MachineType, machineTypeToKorean } from "@/app/machine/[type]/utils";
import { collections } from "@/utils/db";
import { UserInfo } from "@/utils/db/utils";

const PUT = async (
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

    const { machine, time } = await req.json();
    if (!machine || !time) {
      throw new Error("빈칸을 모두 채워주세요.");
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

    const machine_list = await collections.machine_list();
    const machines = await machine_list.findOne({
      // code: machine,
      _id: ObjectId.createFromHexString(machine),
      type: params.type,
      gender: gender,
    });
    if (!machines) { 
      throw new Error("예약할 수 없는 기기입니다.");
    }

    const machineDB = await collections.machine();
    const myMachine = await machineDB.findOne({
      owner: id,
      date: today,
    });
    if (myMachine) { 
      throw new Error("이미 예약된 기기가 있습니다.");
    }

    const machineData = await machineDB.findOne({
      code: machine,
      // _id: ObjectId.createFromHexString(machine),
      type: params.type,
      date: today,
      time: time,
    });
    if (machineData) { 
      throw new Error(`이미 예약된 ${machineTypeToKorean(params.type)}입니다.`);
    }
    const insert = await machineDB.insertOne({
      code: machine,
      type: params.type,
      date: today,
      time: time,
      owner: id,
    });

    if (!insert.insertedId) { 
      throw new Error("예약에 실패했습니다.");
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
        title: "기기 예약에 실패했어요.",
        description: e.message,
      }
    }, {
      status: 400,
    });
    console.error(e.message);
    return response;
  }
};

export default PUT;