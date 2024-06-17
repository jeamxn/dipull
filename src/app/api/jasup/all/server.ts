"use server";

import moment from "moment";

import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";

import { StayDB, getApplyStartDate } from "../../stay/utils";
import { JasupBookDB, JasupDB, JasupData, JasupDataWithUser, JasupTime, JasupWhere, getCurrentTime, getToday } from "../utils";

export type JasupAllPostResponse = {
  data: JasupDataWithUser[];
  count: {
    [key in JasupWhere]: number;
  };
  gradeClass: number;
  date: string;
  time: JasupTime;
  isAdmin: boolean;
};

export const getAllJasup = async (id: string, number: number, { date, time, gradeClass, isStay }: {
  date?: JasupData["date"];
  time?: JasupData["time"];
  gradeClass: JasupData["gradeClass"];
  isStay: boolean;
}) => {
  const todayMoment = getToday();
  const today = todayMoment.format("YYYY-MM-DD");
  const current = getCurrentTime();

  const client = await connectToDatabase();
  const jasupCollection = client.db().collection("jasup");
  const usersCollection = client.db().collection<UserDB>("users");

  const jasupAdminCollection = client.db().collection("jasup_admin");
  const allAdmin = (await jasupAdminCollection.find({}).toArray()).map((admin: any) => admin.id);
  const isAdmin = allAdmin.includes(id) || number === 9999;
  const myGradeClass = Math.floor(number / 100);
  if (!isAdmin && myGradeClass !== gradeClass && myGradeClass !== 99 && gradeClass) {
    return {
      error: true,
      message: "권한이 없습니다.",
    };
  }

  const queryOfGradeClass = gradeClass || (!gradeClass && myGradeClass === 99) ?
    gradeClass === 99 ? {} :
      gradeClass === 10 ? { gradeClass: { $gte: 10, $lt: 20 } } :
        gradeClass === 20 ? { gradeClass: { $gte: 20, $lt: 30 } } :
          gradeClass === 30 || (!gradeClass && myGradeClass === 99) ? { gradeClass: { $gte: 30, $lt: 40 } } :
            { gradeClass } : { gradeClass: myGradeClass };
  const gradeClassQuery = gradeClass || (!gradeClass && myGradeClass === 99) ? 
    gradeClass === 99 ? {
      $gte: 0,
      $lt: 10000,
    } : gradeClass === 10 ? {
      $gte: 1000,
      $lt: 2000,
    } : gradeClass === 20 ? {
      $gte: 2000,
      $lt: 3000,
    } : gradeClass === 30 || (!gradeClass && myGradeClass === 99) ? {
      $gte: 3000,
      $lt: 4000,
    } : { 
      $gte: gradeClass * 100, 
      $lt: (gradeClass + 1) * 100 
    } : {
      $gte: Math.floor(number / 100) * 100,
      $lt: Math.floor(number / 100 + 1) * 100
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
    "203": 0,
    water: 0,
    bathroom: 0,
    laundry: 0,
    corridor: 0,
  };

  const none_id: JasupDataWithUser[] = [];
  const users = await usersCollection.find({ 
    number: gradeClassQuery,
    type: "student"
  }).toArray() as unknown as UserDB[];
  const jasupBookCollection = client.db().collection("jasup_book");
  for(const e of users) {
    const mys = await jasupBookCollection.find({
      id: e.id,
      days: { $elemMatch: { $eq: date ? moment(date, "YYYY-MM-DD").day() : todayMoment.day() } },
      times: { $elemMatch: { $eq: time || current } },
    }).toArray() as unknown as JasupBookDB[];
    const my = mys.length ? mys.reverse().find((e) => e.dates.start <= (date || today) && e.dates.end >=  (date || today)) || {} as JasupBookDB : {} as JasupBookDB;
    none_id.push({
      id: e.id,
      name: e.name || "",
      number: e.number || 0,
      gender: e.gender,
      type: my?.type || "none",
      etc: my?.etc || "",
    });
  }

  for(const e of data) {
    for(const u of none_id) {
      if(e.id === u.id) {
        u.type = e.type;
        u.etc = e.etc;
      }
    }
  }

  const newNoneId: (JasupDataWithUser)[] = [];

  if(isStay) {
    const stayCollection = client.db().collection("stay");
    const query = { week: await getApplyStartDate() };
    const result = await stayCollection.find(query).toArray() as unknown as StayDB[];
    result.forEach((e) => {
      for(let i = 0; i < none_id.length; i++) {
        if(e.owner === none_id[i].id) {
          newNoneId.push({
            ...none_id[i],
            etc: none_id[i].etc ? none_id[i].etc : e.seat === "교실" ? "교실" : `좌석 ${e.seat}`,
          });
        }
      }
    });
  }
  else {
    for(const e of none_id) {
      newNoneId.push(e);
    }
  }

  for(const e of newNoneId) {
    cnt[e.type] += 1;
  }

  const outer: JasupAllPostResponse = {
    data: newNoneId.sort((a, b) => a.number - b.number),
    count: cnt,
    gradeClass: !gradeClass && myGradeClass === 99 ? 30 : gradeClass || Math.floor(number / 100),
    date: date || today,
    time: time || current,
    isAdmin,
  };

  return {
    error: false,
    data: outer,
  };
};

