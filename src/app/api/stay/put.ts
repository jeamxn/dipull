import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { StayData, StudyroomDB, StudyroomData, getApplyEndDate, getApplyStartDate } from "./utils";

const PUT = async (
  req: Request,
) => {
  let { seat } = await req.json();

  if(seat === "@0") seat = "교실";

  // 헤더 설정
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
  
  // Authorization 헤더 확인
  const authorization = headers().get("authorization");
  const verified = await verify(authorization?.split(" ")[1] || "");
  if(!verified.ok || !verified.payload?.id) return new NextResponse(JSON.stringify({
    message: "로그인이 필요합니다.",
  }), {
    status: 401,
    headers: new_headers
  });

  if(!seat) return new NextResponse(JSON.stringify({
    success: false,
    message: "자리를 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  const currentTime = moment().tz("Asia/Seoul");
  const applyStartDate = moment(await getApplyStartDate()).tz("Asia/Seoul");
  const applyEndDate = moment(await getApplyEndDate()).tz("Asia/Seoul");
  if(currentTime.isBefore(applyStartDate) || currentTime.isAfter(applyEndDate)) {
    return new NextResponse(JSON.stringify({
      success: false,
      message: "잔류 신청 기간이 아닙니다.",
    }), {
      status: 400,
      headers: new_headers
    });
  }

  // DB 접속
  const client = await connectToDatabase();
  const stayCollection = client.db().collection("stay");

  const studyroomCollection = client.db().collection("studyroom");
  const getAllOfStudyroom = await studyroomCollection.find({}).toArray() as unknown as StudyroomDB[];
  const studyroomData: StudyroomData[] = getAllOfStudyroom.map(({_id, ...e}) => e);
  const type = studyroomData.find(
    e => e.seat[seat[0]]?.includes(parseInt(seat.slice(1, seat.length)))
  );
  if(
    seat !== "교실"
    &&
    (
      !type?.color 
        || type.gender !== verified.payload.data.gender 
        || !type.grade.includes(Math.floor(verified.payload.data.number / 1000))
    )
  ) {
    return new NextResponse(JSON.stringify({
      success: false,
      message: "허용된 열람실 좌석이 아닙니다.",
    }), {
      status: 400,
      headers: new_headers
    });
  }


  const mySelectQuery = { week: await getApplyStartDate(), owner: verified.payload.id };
  const mySelect = await stayCollection.findOne(mySelectQuery);
  if(mySelect) {
    return new NextResponse(JSON.stringify({
      success: false,
      message: "이미 잔류 신청했습니다.",
    }), {
      status: 400,
      headers: new_headers
    });
  }

  const seetSelectQuery = { week: await getApplyStartDate(), seat: seat };
  const seatSelect = await stayCollection.findOne(seetSelectQuery);
  if(seatSelect) {
    return new NextResponse(JSON.stringify({
      success: false,
      message: "이미 신청된 자리입니다.",
    }), {
      status: 400,
      headers: new_headers
    });
  }

  const put_data: StayData = {
    week: await getApplyStartDate(),
    seat: seat,
    owner: verified.payload.id
  };
  const put = await stayCollection.insertOne(put_data);

  if(put.acknowledged) {
    return new NextResponse(JSON.stringify({
      success: true,
      message: "잔류 신청을 완료했습니다.",
      data: put_data,
    }), {
      status: 200,
      headers: new_headers
    });
  }
  else {
    return new NextResponse(JSON.stringify({
      success: false,
      message: "잔류 신청을 실패했습니다.",
    }), {
      status: 500,
      headers: new_headers
    });
  }
};

export default PUT;