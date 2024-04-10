import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

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

  const client = await connectToDatabase();
  const atheleticAdminCollection = client.db().collection("atheletic_admin");
  const allAdmin = (await atheleticAdminCollection.find({}).toArray()).map((admin: any) => admin.id);
  if(!allAdmin.includes(verified.payload.id)) return new NextResponse(JSON.stringify({
    message: "권한이 없습니다.",
  }), {
    status: 403,
    headers: new_headers
  });

  
  const { type } = await req.json();
  if(!type || (type !== "score" && type !== "set")) return new NextResponse(JSON.stringify({
    success: false,
    message: "올바르지 않은 요청입니다.",
  }), {
    status: 400,
    headers: new_headers
  });

  const atheleticScoreCollection = client.db().collection("atheletic_set_score");
  const deleting = await atheleticScoreCollection.deleteMany({ type });
  if(deleting.acknowledged) return new NextResponse(JSON.stringify({
    success: true,
    message: "초기화 성공했습니다.",
  }), {
    status: 200,
    headers: new_headers
  });
  else {
    return new NextResponse(JSON.stringify({
      success: false,
      message: "초기화에 실패했습니다.",
    }), {
      status: 500,
      headers: new_headers
    });
  }


};

export default PUT;