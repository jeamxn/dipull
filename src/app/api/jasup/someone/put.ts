import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { JasupData, getCurrentTime, getToday } from "../utils";

const PUT = async (
  req: Request,
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

  const { type, etc, id }: {
    id: JasupData["id"];
    type: JasupData["type"];
    etc: JasupData["etc"];
  } = await req.json();

  if(!id) return new NextResponse(JSON.stringify({
    message: "학생을 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  if(!type) return new NextResponse(JSON.stringify({
    message: "위치를 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  if(!etc && (type === "etcroom" || type === "outing")) return new NextResponse(JSON.stringify({
    message: "자세한 위치를 입력해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  const client = await connectToDatabase();
  const jasupAdminCollection = client.db().collection("jasup_admin");
  const allAdmin = (await jasupAdminCollection.find({}).toArray()).map((admin: any) => admin.id);
  if(!allAdmin.includes(verified.payload.id) && verified.payload.data.number !== 9999) return new NextResponse(JSON.stringify({
    message: "권한이 없습니다.",
  }), {
    status: 403,
    headers: new_headers
  });

  const today = getToday().format("YYYY-MM-DD");
  const current = getCurrentTime();
  const usersCollection = client.db().collection<UserDB>("users");
  const selectedUser = await usersCollection.findOne({
    id: id,
  });
  const number = selectedUser?.number || 0;
  const data: JasupData = {
    id: id,
    gradeClass: Math.floor(number / 100),
    date: today,
    time: current,
    type,
    etc,
  };

  const jasupCollection = client.db().collection("jasup");
  const put = await jasupCollection.updateOne({
    id: data.id,
    date: data.date,
    time: data.time,
  }, {
    $set: data,
  }, {
    upsert: true,
  });

  if(put) {
    return new NextResponse(JSON.stringify({
      message: "성공적으로 위치를 변경했습니다.",
      ok: true,
    }), {
      status: 200,
      headers: new_headers
    });
  }
  else {
    return new NextResponse(JSON.stringify({
      message: "오류가 발생했습니다.",
      ok: false,
    }), {
      status: 500,
      headers: new_headers
    });
  }

};

export default PUT;