import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getApplyStartDate } from "@/app/api/stay/utils";
import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

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

  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const selectMember = await userCollection.findOne({ id: verified.payload.data.id }) as unknown as UserDB;
  if(selectMember.type !== "teacher") return new NextResponse(JSON.stringify({
    message: "교사만 접근 가능합니다.",
  }), {
    status: 403,
    headers: new_headers
  });

  const { grade } = await req.json();
  if(!grade) return new NextResponse(JSON.stringify({
    message: "학년을 입력해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  const stayCollection = client.db().collection("stay");
  const query = {
    week: await getApplyStartDate(),
    number: { $gte: grade * 1000, $lt: (grade + 1) * 1000 }
  };
  const aggregationPipeline = [
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "id",
        as: "userInfo"
      }
    },
    {
      $unwind: "$userInfo"
    },
    {
      $project: {
        _id: "$_id",
        id: "$owner",
        name: "$userInfo.name",
        number: "$userInfo.number",
        gender: "$userInfo.gender",
        seat: "$seat",
        week: "$week",
      }
    },
    {
      $match: query
    }
  ];
  const origin = await stayCollection.aggregate(aggregationPipeline).toArray();
  const result = origin.map((data) => data._id);
  const update = await stayCollection.updateMany({
    _id: { $in: result }
  }, {
    $set: {
      seat: "교실"
    }
  });

  if(update.matchedCount === 0) return new NextResponse(JSON.stringify({
    message: "변경된 데이터가 없습니다.",
    origin,
    result
  }), {
    status: 400,
    headers: new_headers
  });
  return new NextResponse(JSON.stringify({
    message: `${grade}학년 전체 교실로 잔류 위치 수정됐습니다.`,
  }), {
    status: 200,
    headers: new_headers
  });

};

export default POST;