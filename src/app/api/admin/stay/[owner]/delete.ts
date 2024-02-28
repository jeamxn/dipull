import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getApplyEndDate, getApplyStartDate } from "@/app/api/stay/utils";
import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

type Params = {
  owner: string;
};

const DELETE = async (
  req: Request,
  { params }: { params: Params }
) => {
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

  if(!params.owner) return new NextResponse(JSON.stringify({
    success: false,
    message: "학생을 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  // DB 접속
  const stayCollection = client.db().collection("stay");

  const mySelectQuery = { week: getApplyStartDate(), owner: params.owner };
  const deleteMySelect = await stayCollection.deleteOne(mySelectQuery);

  if(deleteMySelect.deletedCount) {
    return new NextResponse(JSON.stringify({
      success: true,
      message: "잔류 신청을 취소했습니다.",
    }), {
      status: 200,
      headers: new_headers
    });
  }
  else {
    return new NextResponse(JSON.stringify({
      success: false,
      message: "신청한 잔류가 없습니다.",
    }), {
      status: 400,
      headers: new_headers
    });
  }
};

export default DELETE;