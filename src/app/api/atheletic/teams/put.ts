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

  
  const { left, right } = await req.json();
  if(!left || !right) return new NextResponse(JSON.stringify({
    success: false,
    message: "팀 이름을 입력해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  const statesCollection = client.db().collection("states");
  const edit = await statesCollection.updateOne({ 
    type: "atheletic_teams_name" 
  }, { $set: { data: {
    left, right
  } } }, { upsert: true });

  if(edit.acknowledged){
    return new NextResponse(JSON.stringify({
      success: true,
      message: "팀 이름이 설정되었습니다.",
    }), {
      status: 200,
      headers: new_headers
    });
  }
  else {
    return new NextResponse(JSON.stringify({
      success: false,
      message: "팀 이름 설정에 실패했습니다.",
    }), {
      status: 500,
      headers: new_headers
    });
  }
};

export default PUT;