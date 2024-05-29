import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { getStates } from "@/utils/getStates";
import { verify } from "@/utils/jwt";

import { ByGradeClassObj, BySeatsObj, StayGetResponse, StayDB, getApplyStartDate, StudyroomDB, StudyroomData, GradeClassInner } from "./utils";

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

  // DB 접속
  const client = await connectToDatabase();
  const stayCollection = client.db().collection("stay");
  const studyroomCollection = client.db().collection("studyroom");
  const query = { week: await getApplyStartDate() };
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
        _id: 0,
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
  const result = await stayCollection.aggregate(aggregationPipeline).toArray();


  const bySeatsObj: BySeatsObj = {};
  const byGradeClassObj: ByGradeClassObj = {};
  for(const e of result) {
    if(!bySeatsObj[e.seat[0]]) bySeatsObj[e.seat[0]] = {};
    bySeatsObj[e.seat[0]][e.seat.slice(1, e.seat.length)] = `${e.number} ${e.name}`;
    const grade = Math.floor(e.number / 1000);
    const classNum = Math.floor(e.number / 100) % 10;
    if(!byGradeClassObj[grade]) byGradeClassObj[grade] = {};
    if(!byGradeClassObj[grade][classNum]) byGradeClassObj[grade][classNum] = [];
    const pushData: GradeClassInner = {
      id: e.id,
      name: e.name,
      number: e.number,
      gender: e.gender,
      seat: e.seat,
      week: e.week,
    };
    byGradeClassObj[grade][classNum].push(pushData);
  }

  const mySelectQuery = { week: await getApplyStartDate(), owner: verified.payload.id };
  const mySelect = await stayCollection.findOne(mySelectQuery) as unknown as StayDB;
  const { seat } = mySelect || { seat: "" };
  
  const getAllOfStudyroom = await studyroomCollection.find({}).toArray() as unknown as StudyroomDB[];
  const studyroomData: StudyroomData[] = getAllOfStudyroom.map(({ _id, ...e }) => e);
  const classStay = await getStates("class_stay");

  const stayResponse: StayGetResponse = {
    message: "성공적으로 데이터를 가져왔습니다.",
    data: { 
      bySeatsObj, 
      byGradeClassObj,
      mySelect: seat,
      studyroom: studyroomData,
      classStay
    },
    query
  };

  return new NextResponse(JSON.stringify(stayResponse), {
    status: 200,
    headers: new_headers,
  });
};

export default GET;