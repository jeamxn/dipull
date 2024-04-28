import "moment-timezone";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { UserInfo } from "../userinfo/utils";

const GET = async (
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
  const userCollection = client.db().collection("users");
  const selectMember = await userCollection.findOne({ id: verified.payload.data.id }) as unknown as UserDB;
  if(selectMember.type !== "teacher") return new NextResponse(JSON.stringify({
    message: "교사만 접근 가능합니다.",
  }), {
    status: 403,
    headers: new_headers
  });

  const jasupAdminCollection = client.db().collection("jasup_admin");
  const getAll = await jasupAdminCollection.find({}).toArray();

  const users: UserInfo[] = [];
  for(const data of getAll) {
    const user = await userCollection.findOne({ id: data.id }) as unknown as UserDB;
    users.push({
      id: user.id,
      gender: user.gender,
      name: user.name,
      number: user.number,
      profile_image: user.profile_image,
      type: user.type,
    });
  }

  return new NextResponse(JSON.stringify({
    message: "자습 도우미 학생 목록을 성공적으로 불러왔습니다.",
    data: users.sort((a, b) => a.number - b.number),
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;