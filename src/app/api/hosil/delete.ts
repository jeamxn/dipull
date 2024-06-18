import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";


const DELETE = async (
  req: Request,
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

  const client = await connectToDatabase();
  const hosilCollection = client.db().collection("hosil");

  const result = await hosilCollection.deleteOne({
    id: verified.payload.data.id,
  });
  if(result.deletedCount === 1) return new NextResponse(JSON.stringify({
    message: "호실 선택이 취소되었습니다.",
    ok: true,
  }), {
    status: 200,
    headers: new_headers
  });

  return new NextResponse(JSON.stringify({
    message: "오류가 발생했습니다.",
    ok: false,
  }), {
    status: 200,
    headers: new_headers
  });
};

export default DELETE;