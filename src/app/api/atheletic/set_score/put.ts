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

  
  const { team, score, type } = await req.json();
  if(!team) return new NextResponse(JSON.stringify({
    success: false,
    message: "팀을 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  if(!score) return new NextResponse(JSON.stringify({
    success: false,
    message: "점수를 입력해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  if(!type) return new NextResponse(JSON.stringify({
    success: false,
    message: "증감 종류를 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  const atheleticScoreCollection = client.db().collection("atheletic_set_score");
  const put = await atheleticScoreCollection.insertOne({
    team,
    score,
    type,
  });

  if(!put.acknowledged) return new NextResponse(JSON.stringify({
    success: false,
    message: "점수를 추가하는데 실패하였습니다.",
  }), {
    status: 500,
    headers: new_headers
  });
  else {
    return new NextResponse(JSON.stringify({
      success: true,
      message: "점수가 성공적으로 추가되었습니다.",
    }), {
      status: 200,
      headers: new_headers
    });
  }
};

export default PUT;