"use server";

import { connectToDatabase } from "@/utils/db";

import { TimetableResponse } from "./get";

export const getTimetable = async (grade: number, _class: number) => { 
  const client = await connectToDatabase();
  const timetableCollection = client.db().collection("timetable");
  const periods = await timetableCollection.aggregate([
    {
      $match: {
        grd: Number(grade),
        cls: Number(_class)
      },
    },
    {
      $sort: {
        weekday: 1,
        period: 1
      }
    },
    {
      $group: {
        _id: "$period",
        timetable: {
          $push: {
            grd: "$grd",
            cls: "$cls",
            weekday: "$weekday",
            period: "$period",
            teacher: "$teacher",
            subject: "$subject",
            classroom: "$classroom",
            changed: "$changed",
            code: "$code"
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        // weekday: "$_id",
        timetable: 1
      }
    },
    {
      $sort: {
        weekday: 1
      }
    }
  ]).toArray() as any;
  const periodsObject: TimetableResponse["data"] = periods.map((e: any) => e.timetable);
  return periodsObject;
};