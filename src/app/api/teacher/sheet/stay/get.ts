import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { OutingDB, defaultOutingData } from "@/app/api/outing/utils";
import { ByGradeClassObj, StayDB, getApplyStartDate } from "@/app/api/stay/utils";
import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";


import { SheetByGradeClassObj, SheetGradeClassInner, SheetResponse } from "./utils";

const GET = async (
  req: Request,
) => {
  // 헤더 설정
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
  
  // Authorization 헤더 확인
  const authorization = headers().get("authorization");
  const verified = await verify(authorization?.split(" ")[1] || "");
  if (!verified.ok || !verified.payload?.id) {
    try {    
      const type = req.url.split("?")[1].split("=")[1];
      if(type !== process.env.TEACHERS_CODE) return new NextResponse(JSON.stringify({
        message: "로그인이 필요합니다.",
      }), {
        status: 401,
        headers: new_headers
      });
    }
    catch {
      return new NextResponse(JSON.stringify({
        message: "로그인이 필요합니다.",
      }), {
        status: 401,
        headers: new_headers
      });
    }
  }
  else {
    const client = await connectToDatabase();
    const userCollection = client.db().collection("users");
    const selectMember = await userCollection.findOne({ id: verified.payload.data.id }) as unknown as UserDB;
    if (selectMember.type !== "teacher") return new NextResponse(JSON.stringify({
      message: "교사만 접근 가능합니다.",
    }), {
      status: 403,
      headers: new_headers
    });
  }
  const client = await connectToDatabase();
  const stayCollection = client.db().collection("stay");
  const query = { week: await getApplyStartDate() };

  const result = await stayCollection.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "id",
        as: "user"
      }
    },
    {
      $lookup: {
        from: "outing",
        let: { ownerId: "$owner", week: "$week" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$owner", "$$ownerId"] },
                  { $eq: ["$week", "$$week"] }
                ]
              }
            }
          }
        ],
        as: "outing"
      }
    },
    {
      $addFields: {
        user: { $arrayElemAt: ["$user", 0] },
        outing: { $arrayElemAt: ["$outing", 0] }
      }
    },
    {
      $addFields: {
        grade: { $floor: { $divide: ["$user.number", 1000] } },
        classNum: { $floor: { $mod: [{ $divide: ["$user.number", 100] }, 10] } }
      }
    },
    {
      $group: {
        _id: { grade: "$grade", classNum: "$classNum" },
        data: {
          $push: {
            id: "$user.id",
            name: "$user.name",
            number: "$user.number",
            gender: "$user.gender",
            seat: "$seat",
            week: "$week",
            sat: { $ifNull: ["$outing.sat", defaultOutingData] },
            sun: { $ifNull: ["$outing.sun", defaultOutingData] }
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        grade: "$_id.grade",
        classNum: "$_id.classNum",
        data: 1
      }
    }
  ]).toArray();

  const byGradeClassObj: SheetByGradeClassObj = {};
  result.forEach((item: any) => {
    const { grade, classNum, data } = item;
    if (!byGradeClassObj[grade]) byGradeClassObj[grade] = {};
    if (!byGradeClassObj[grade][classNum]) byGradeClassObj[grade][classNum] = [];
    byGradeClassObj[grade][classNum] = data;
  });
  
  const response: SheetResponse = {
    message: "성공적으로 데이터를 가져왔습니다.",
    data: byGradeClassObj,
    query
  };

  return new NextResponse(JSON.stringify(response), {
    headers: new_headers
  });
};

export default GET;