"use server";

import { collections } from "@/utils/db";

import { TimetableResponse } from "./get";

export const getTimetable = async (grade: number, _class: number) => { 
  const timetable = await collections.timetable();
  const periods = await timetable.aggregate([
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
        timetable: 1
      }
    },
    {
      $sort: {
        weekday: 1
      }
    }
  ]).toArray();
  const periodsObject: TimetableResponse["data"] = periods.map((e) => e.timetable);
  return periodsObject;
};