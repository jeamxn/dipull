import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { JasupDB, JasupData, JasupDataWithUser, JasupWhere, getCurrentTime, getToday } from "../utils";

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

  const today = getToday().format("YYYY-MM-DD");
  const current = getCurrentTime();

  const client = await connectToDatabase();
  const jasupCollection = client.db().collection("jasup");
  const usersCollection = client.db().collection<UserDB>("users");

  const { date, time, gradeClass }: {
    date: JasupData["date"];
    time: JasupData["time"];
    gradeClass: JasupData["gradeClass"];
  } = await req.json();

  const jasupAdminCollection = client.db().collection("jasup_admin");
  const allAdmin = (await jasupAdminCollection.find({}).toArray()).map((admin: any) => admin.id);
  const isAdmin = allAdmin.includes(verified.payload.id) || verified.payload.data.number === 9999;
  const myGradeClass = Math.floor(verified.payload.data.number / 100);
  if(!isAdmin && myGradeClass !== gradeClass && myGradeClass !== 99 && gradeClass) return new NextResponse(JSON.stringify({
    message: "권한이 없습니다.",
  }), {
    status: 403,
    headers: new_headers
  });

  const queryOfGradeClass = gradeClass || (!gradeClass && myGradeClass === 99) ?
    gradeClass === 99 || (!gradeClass && myGradeClass === 99) ? {} :
      gradeClass === 10 ? { gradeClass: { $gte: 10, $lt: 20 } } :
        gradeClass === 20 ? { gradeClass: { $gte: 20, $lt: 30 } } :
          gradeClass === 30 ? { gradeClass: { $gte: 30, $lt: 40 } } :
            { gradeClass } : { gradeClass: myGradeClass };
  const gradeClassQuery = gradeClass || (!gradeClass && myGradeClass === 99) ? 
    gradeClass === 99 || (!gradeClass && myGradeClass === 99) ? {
      $gte: 0,
      $lt: 10000,
    } : gradeClass === 10 ? {
      $gte: 1000,
      $lt: 2000,
    } : gradeClass === 20 ? {
      $gte: 2000,
      $lt: 3000,
    } : gradeClass === 30 ? {
      $gte: 3000,
      $lt: 4000,
    } : { 
      $gte: gradeClass * 100, 
      $lt: (gradeClass + 1) * 100 
    } : {
      $gte: Math.floor(verified.payload.data.number / 100) * 100,
      $lt: Math.floor(verified.payload.data.number / 100 + 1) * 100
    };

  const data = await jasupCollection.find({
    date: date || today,
    time: time || current,
    ...queryOfGradeClass,
  }).toArray() as unknown as JasupDB[];

  const cnt: {
    [key in JasupWhere]: number;
  } = {
    none: 0,
    classroom: 0,
    studyroom: 0,
    KTroom: 0,
    etcroom: 0,
    healthroom: 0,
    dormitory: 0,
    outing: 0,
    home: 0,
    afterschool: 0,
  };

  const none_id: JasupDataWithUser[] = [];
  const users = await usersCollection.find({ 
    number: gradeClassQuery,
    type: "student"
  }).toArray() as unknown as UserDB[];
  for(const e of users) {
    none_id.push({
      id: e.id,
      name: e.name || "",
      number: e.number || 0,
      gender: e.gender,
      type: "none",
      etc: "",
    });
  }

  for(const e of data) {
    cnt[e.type]++;
    for(const u of none_id) {
      if(e.id === u.id) {
        u.type = e.type;
        u.etc = e.etc;
      }
    }
  }
  cnt["none"] += none_id.length - data.length;

  return new NextResponse(JSON.stringify({
    message: "성공적으로 데이터를 가져왔습니다.",
    data: {
      data: none_id.sort((a, b) => a.number - b.number),
      count: cnt,
      gradeClass: gradeClass || Math.floor(verified.payload.data.number / 100),
      date: date || today,
      time: time || current,
      isAdmin,
    },
  }), {
    status: 200,
    headers: new_headers
  });
};

export default POST;