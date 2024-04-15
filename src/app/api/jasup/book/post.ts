import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { JasupBookDB, JasupBookPutData } from "../utils";

const POST = async (
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

  const { _id }: {
    _id: JasupBookDB["_id"];
  } = await req.json();
  if(!_id) return new NextResponse(JSON.stringify({
    success: false,
    message: "올바르지 않은 요청입니다.",
  }), {
    status: 400,
    headers: new_headers
  });

  const client = await connectToDatabase();
  const jasupBookCollection = client.db().collection("jasup_book");
  const objcet_id = ObjectId.createFromHexString(_id);
  const my = await jasupBookCollection.deleteOne({ 
    _id: objcet_id,
    id: verified.payload.id
  });

  if(my.deletedCount === 0) return new NextResponse(JSON.stringify({
    success: false,
    message: "자습 예약이 존재하지 않습니다.",
  }), {
    status: 400,
    headers: new_headers
  });
  else {
    return new NextResponse(JSON.stringify({
      success: true,
      message: "자습 예약이 취소되었습니다.",
    }), {
      status: 200,
      headers: new_headers
    });
  }
};

export default POST;