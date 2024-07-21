"use server";

import { connectToDatabase } from "@/utils/db";

import { getApplyStartDate } from "../../stay/utils";
import { defaultWakeupAvail } from "../apply/utils";

import { Rank } from "./utils";

export const getWakeupRanking = async () => { 
  const client = await connectToDatabase();
  const wakeupAplyCollection = client.db().collection("wakeup_aply");
  const week = await getApplyStartDate();
  const find = await wakeupAplyCollection.aggregate([
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
      $match: {
        // date: week,
        available: {
          $ne: defaultWakeupAvail
        }
      }
    },
    {
      $sort: {
        available: -1,
        "userInfo.number": 1,
      }
    },
    {
      $limit: 10,
    },
    {
      $project: {
        _id: 0,
        available: "$available",
        gender: "$userInfo.gender",
        name: "$userInfo.name",
        number: "$userInfo.number",
      }
    },
  ]).toArray();

  const rt: Rank[] = find.map((e) => { 
    const grade = Math.floor(e.number / 1000);
    const classNum = Math.floor(e.number / 100) % 10;
    const name_split: string[] = e.name.replace(/ /g, "").split("");
    const new_name = name_split.map((e, i) => { 
      if (i === 0 || i === name_split.length - 1) {
        return e;
      }
      else {
        return "*";
      }
    }).join("");
    return {
      available: e.available,
      gender: e.gender,
      name: `${grade}학년 ${classNum}반 ${name_split.length > 2 ? new_name : `${name_split[0]}*`}`,
    };
  });

  return rt;
};