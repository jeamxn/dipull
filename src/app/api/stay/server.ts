"use server";

import { connectToDatabase } from "@/utils/db";
import { getStates } from "@/utils/getStates";

import { ByGradeClassObj, BySeatsObj, StayDB, getApplyStartDate, StudyroomDB, StudyroomData, GradeClassInner } from "./utils";

export const getStayApply = async (id: string) => { 
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

  const mySelectQuery = { week: await getApplyStartDate(), owner: id };
  const mySelect = await stayCollection.findOne(mySelectQuery) as unknown as StayDB;
  const { seat } = mySelect || { seat: "" };
  
  const getAllOfStudyroom = await studyroomCollection.find({}).toArray() as unknown as StudyroomDB[];
  const studyroomData: StudyroomData[] = getAllOfStudyroom.map(({ _id, ...e }) => e);
  const classStay = await getStates("class_stay");

  return {
    data: {
      bySeatsObj,
      byGradeClassObj,
      mySelect: seat,
      studyroom: studyroomData,
      classStay,
    },
    query
  };
};