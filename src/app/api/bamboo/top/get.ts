import "moment-timezone";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

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
  const bambooCollection = client.db().collection("bamboo");
  const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
  const bamboos = await bambooCollection.aggregate([
    {
      $match: {
        timestamp: {
          $gte: today,
        }
      },
    },
    {
      $sort: {
        number: -1,
      },
    },
    {
      $limit: 3,
    }
  ]).toArray();
  const userCollection = client.db().collection("users");

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
    data: newBamboo,
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;