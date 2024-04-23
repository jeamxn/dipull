import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

const POST = async (
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

  const json = await req.json();
  const start = json.start || 0;
  const end = json.end || 0;
  
  const client = await connectToDatabase();
  const statesCollection = client.db().collection("states");
  const counting = (await statesCollection.findOne({
    type: "bamboo_comment",
  }))?.count?.[params.id] || 0;

  const bambooCommentCollection = client.db().collection("bamboo_comment");
  const userCollection = client.db().collection("users");
  const bamboos = await bambooCommentCollection.find({
    document: params.id,
    number: {
      $lte: counting - start,
      $gt: counting - 20 - start,
    }
  }).toArray();
  const newBamboo = await Promise.all(
    bamboos.map(async (bamboo) => {
      const user = await userCollection.findOne({
        id: bamboo.user,
      });
      return {
        _id: bamboo._id,
        user: `${bamboo.grade ? `${Math.floor(user?.number / 1000)}학년 ` : ""}${bamboo.anonymous ? "익명" : user?.name}`,
        text: bamboo.text,
        timestamp: bamboo.timestamp,
        number: bamboo.number,
        isgood: bamboo.good?.includes(verified.payload.id) || false,
        isbad: bamboo.bad?.includes(verified.payload.id) || false,
        good: bamboo.good?.length || 0,
        bad: bamboo.bad?.length || 0,
      };
    })
  );

  return new NextResponse(JSON.stringify({
    data: newBamboo.reverse(),
  }), {
    status: 200,
    headers: new_headers
  });
};

export default POST;