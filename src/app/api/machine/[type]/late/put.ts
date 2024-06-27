import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { machineName } from "@/app/(login)/machine/[type]/utils";
import { connectToDatabase } from "@/utils/db";
import { getStates } from "@/utils/getStates";
import { verify } from "@/utils/jwt";

import { MachineConfig, Params, getApplyEndTime, getApplyStartTime } from "../utils";

const PUT = async (
  req: Request,
  { params }: { params: Params }
) => {
  // 헤더 설정
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
  
  // Authorization 헤더 확인
  const authorization = headers().get("authorization");
  const accessToken = authorization?.split(" ")[1] || "";
  const verified = await verify(accessToken);
  if(!verified.ok || !verified.payload?.id || !verified.payload?.data.id) return new NextResponse(JSON.stringify({
    message: "로그인이 필요합니다.",
  }), {
    status: 401,
    headers: new_headers
  });

  const currentTime = moment(moment().tz("Asia/Seoul").format("HH:mm"), "HH:mm");
  const applyStartDate = moment(await getApplyStartTime(), "HH:mm");
  const applyEndDate = moment(await getApplyEndTime(), "HH:mm");
  if(currentTime.isBefore(applyStartDate) || currentTime.isAfter(applyEndDate)) {
    return new NextResponse(JSON.stringify({
      success: false,
      message: `${applyStartDate.format("HH시 mm분")}부터 ${applyEndDate.format("HH시 mm분")} 사이에 신청 가능합니다.`,
    }), {
      status: 400,
      headers: new_headers
    });
  }

  const { machine, late, time } = await req.json();
  if (!machine || !late) return new NextResponse(JSON.stringify({
    success: false,
    message: "빈칸을 모두 채워주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  if (!late || isNaN(Number(late))) return new NextResponse(JSON.stringify({
    success: false,
    message: "지연 시간은 숫자로 입력해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  const client = await connectToDatabase();
  const machineCollection = client.db().collection("machine");

  const commonQuery = {
    type: params.type,
    machine,
    date: moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
  };

  const isIBookedQuery = {
    ...commonQuery,
    owner: verified.payload.data.id,
  };
  const isIBooked = await machineCollection.findOne(isIBookedQuery);
  if(!isIBooked) return new NextResponse(JSON.stringify({
    success: false,
    message: "지연 신청할 기계가 없습니다.",
  }), {
    status: 400,
    headers: new_headers
  });

  const machineLateCollection = client.db().collection("machine_late");
  const update = await machineLateCollection.updateOne({
    ...commonQuery,
  }, {
    $set: {
      ...commonQuery,
    },
    $inc: {
      late: Number(Math.floor(late)),
    },
    $push: {
      log: {
        user: verified.payload.data.id,
        late: Number(Math.floor(late)),
      },
    }
  }, {
    upsert: true,
  });
  const find_updated = await machineLateCollection.findOne({
    ...commonQuery,
  }) || { late: 0 };

  const machineConfig: MachineConfig = await getStates("machine_time");
  const stayConfig = machineConfig.stay;
  const commonConfig = machineConfig.common;
  const isStay = moment().tz("Asia/Seoul").day() === 0 || moment().tz("Asia/Seoul").day() === 6;
  const isAllTime = isStay || await getStates("machine_all_time");
  const timeData = isAllTime ? stayConfig[params.type] : commonConfig[params.type];
  const indexx = timeData.findIndex((item) => item === time);
  const removePrevious = timeData.slice(0, indexx);

  const userList = (await machineCollection.find({
    ...commonQuery,
    time: {
      $in: removePrevious,
    },
  }).toArray()).map((item: any) => item.owner) as unknown as string[];

  const machineString = `${machineName(machine)} ${params.type === "washer" ? "세탁" : "건조"}기`;

  const notificationCollection = client.db().collection("notification");
  const payLoad = {
    "id": userList,
    "payload": {
      "title": `${Math.floor(verified.payload.data.number / 1000)}학년 ${verified.payload.data.name}님이 죄송하다고 해요.`,
      "body": Number(Math.floor(late)) > 0 ?
        `${machineString}가 ${Number(Math.floor(late))}분 지연되어 총 ${find_updated.late}분 지연되었습니다.`
        : `${machineString}의 지연이 ${Number(Math.floor(late)) * -1}분 감소하여 총 ${find_updated.late}분 지연되었습니다.`,
    },
    "type": "machine-late",
    "time": "1999-12-31 23:59:59"
  };
  await notificationCollection.insertOne(payLoad);

  if (update.modifiedCount === 0 && update.upsertedCount === 0) return new NextResponse(JSON.stringify({
    success: false,
    message: "지연 신청에 실패했습니다.",
  }), {
    status: 500,
    headers: new_headers
  });

  return new NextResponse(JSON.stringify({
    success: true,
    message: "지연 신청을 완료했습니다.",
    userList,
  }), {
    status: 200,
    headers: new_headers
  });
};

export default PUT;