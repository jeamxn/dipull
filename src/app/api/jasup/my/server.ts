"use server";

import moment from "moment";

import { connectToDatabase } from "@/utils/db";

import { JasupBookDB, JasupDB, JasupData, getCurrentTime, getToday } from "../utils";

export const getMyJasup = async (id: string, req: {
  date?: JasupData["date"];
  time?: JasupData["time"];
  gradeClass?: JasupData["gradeClass"];
}) => { 
  const todayMoment = getToday();
  const today = todayMoment.format("YYYY-MM-DD");
  const current = getCurrentTime();

  const client = await connectToDatabase();
  const jasupCollection = client.db().collection<JasupDB>("jasup");

  const { date, time, gradeClass } = req;
  const queryOfGradeClass = gradeClass ? { gradeClass } : {};

  const data = await jasupCollection.findOne({
    id: id,
    date: date || today,
    time: time || current,
    ...queryOfGradeClass,
  });

  const jasupBookCollection = client.db().collection("jasup_book");
  const mys = await jasupBookCollection.find({
    id: id,
    days: { $elemMatch: { $eq: date ? moment(date, "YYYY-MM-DD").day() : todayMoment.day() } },
    times: { $elemMatch: { $eq: time || current } },
  }).toArray() as unknown as JasupBookDB[];
  const my = mys.length ? mys.reverse().find((e) => e.dates.start <= (date || today) && e.dates.end >=  (date || today)) || {} as JasupBookDB : {} as JasupBookDB;

  return {
    type: data?.type || my?.type || "none",
    etc: data?.etc || my?.etc || "",
  };
};