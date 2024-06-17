import "moment-timezone";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { Data } from "@/app/(login)/bamboo/page";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

export const getBambooById = async (userid: string, bambooid: string) => {
  const client = await connectToDatabase();
  const bambooCollection = client.db().collection("bamboo");
  const objcet_id = ObjectId.createFromHexString(bambooid);
  const bamboo = await bambooCollection.findOne({
    _id: objcet_id,
  });
  const userCollection = client.db().collection("users");

  if (!bamboo) return {
    error: true,
    message: "해당하는 글을 찾을 수 없습니다.",
  };

  const user = await userCollection.findOne({
    id: bamboo.user,
  });
  const newBamboo: Data = {
    _id: bamboo._id,
    user: `${bamboo.grade ? `${Math.floor(user?.number / 1000)}학년 ` : ""}${bamboo.anonymous ? "익명" : user?.name}`,
    text: bamboo.text,
    timestamp: bamboo.timestamp,
    number: bamboo.number,
    isgood: bamboo.good?.includes(userid) || false,
    isbad: bamboo.bad?.includes(userid) || false,
    good: bamboo.good?.length || 0,
    bad: bamboo.bad?.length || 0,
  };

  return {
    error: false,
    data: newBamboo,
  };
};

const GET = async (
  req: Request,
  { params }: { params: {
    id: string,
  } }
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

  const { error, message, data } = await getBambooById(verified.payload.id, params.id);
  if(error) return new NextResponse(JSON.stringify({
    message,
  }), {
    status: 404,
    headers: new_headers
  });

  return new NextResponse(JSON.stringify({
    data: data,
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;