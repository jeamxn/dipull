import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { StayData, getApplyStartDate } from "@/app/api/stay/utils";
import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";


const PUT = async (
  req: Request,
) => {
  let { seat, owner } = await req.json();

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
  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const selectMember = await userCollection.findOne({ id: verified.payload.data.id }) as unknown as UserDB;
  if(selectMember.type !== "teacher") return new NextResponse(JSON.stringify({
    message: "교사만 접근 가능합니다.",
  }), {
    status: 403,
    headers: new_headers
  });

  if(!seat) return new NextResponse(JSON.stringify({
    success: false,
    message: "자리를 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  if(!owner) return new NextResponse(JSON.stringify({
    success: false,
    message: "학생을 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  // DB 접속
  const stayCollection = client.db().collection("stay");

  const mySelectQuery = { week: getApplyStartDate(), owner: owner };
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

  const seetSelectQuery = { week: getApplyStartDate(), seat: seat };
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
    week: getApplyStartDate(),
    seat: seat,
    owner: owner,
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