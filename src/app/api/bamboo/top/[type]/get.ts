import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { getApplyStartDate } from "../../../stay/utils";
import { TopBambooType } from "../../utils";

export const getTopBamboo = async (type: TopBambooType, id: string) => {
  const client = await connectToDatabase();
  const statesCollection = client.db().collection("states");

  const bambooCollection = client.db().collection("bamboo");
  const userCollection = client.db().collection("users");
  const bamboos = await bambooCollection.aggregate([
    {
      $match: {
        timestamp: {
          $gte: type === "day" ?
            moment().tz("Asia/Seoul").format("YYYY-MM-DD") :
            type === "week" ? await getApplyStartDate() : "",
        },
      }
    },
    {
      "$addFields": {
        emotion_number: {
          $subtract: [
            { $size: { "$ifNull": ["$good", []] } },
            { $size: { "$ifNull": ["$bad", []] } },
          ],
        },
      },
    },
    {
      $sort: {
        emotion_number: -1,
        timestamp: -1,
      },
    },
    {
      $limit: 3,
    }
  ]).toArray();
  const newBamboo = await Promise.all(
    bamboos.map(async (bamboo) => {
      const [user, commnet] = await Promise.all([
        userCollection.findOne({
          id: bamboo.user,
        }),
        statesCollection.findOne({
          type: "bamboo_comment",
        }),
      ]);
      const gradeNaN = isNaN(Math.floor(user?.number / 1000));
      const grade = gradeNaN ? "졸업생 " : `${Math.floor(user?.number / 1000)}학년 `;
      return {
        _id: bamboo._id,
        user: `${bamboo.grade ? grade : ""}${bamboo.anonymous ? "익명" : user?.name}`,
        text: bamboo.text,
        timestamp: bamboo.timestamp,
        number: bamboo.number,
        isgood: bamboo.good?.includes(id) || false,
        isbad: bamboo.bad?.includes(id) || false,
        good: bamboo.good?.length || 0,
        bad: bamboo.bad?.length || 0,
        comment: commnet?.count?.[bamboo._id.toString()] || 0,
      };
    })
  );

  return newBamboo.sort((a, b) => (b.good.length - b.bad.length) - (a.good.length - a.bad.length));
};

const GET = async (
  req: Request,
  { params }: { params: {
    type: TopBambooType;
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

  return new NextResponse(JSON.stringify({
    data: await getTopBamboo(params.type, verified.payload.id),
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;