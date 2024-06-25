"use server";

import { getApplyStartDate } from "@/app/api/stay/utils";
import { connectToDatabase } from "@/utils/db";

import { WakeupDB, WakeupGET, getToday } from "./utils";

export const getWakeup = async (id: string, gender: string) => {
  const today = getToday();
  const client = await connectToDatabase();
  const wakeupCollection = client.db().collection("wakeup");
  const query = {
    week: await getApplyStartDate(),
    gender: gender,
  };
  const data = await wakeupCollection.find(query).toArray() as unknown as WakeupDB[];

  const allObj: WakeupGET = {};
  const myObj: WakeupDB[] = [];
  
  for (const v of data) {
    if (!allObj[v.id]) {
      allObj[v.id] = {
        title: v.title,
        date: v.date,
        count: 0,
        week: v.week,
      };
    }
    allObj[v.id].count++;
    if (v.owner === id && v.date === today.format("YYYY-MM-DD")) {
      myObj.push({
        title: v.title,
        id: v.id,
        date: v.date,
        owner: v.owner,
        _id: v._id.toString(),
        gender: v.gender,
        week: v.week,
      });
    }
  }

  return {
    all: allObj,
    my: myObj,
    today: today.format("YYYY-MM-DD"),
    gender: gender,
    week: await getApplyStartDate(),
  };
};

export const getPlayedWakeup = async (id: string, gender: string) => {
  const today = getToday();
  const client = await connectToDatabase();
  const played_wakeupCollection = client.db().collection("played_wakeup");
  const query = {
    week: await getApplyStartDate(),
    gender: gender,
  };
  const data = await played_wakeupCollection.find(query).toArray() as unknown as WakeupDB[];

  const allObj: WakeupGET = {};
  const myObj: WakeupDB[] = [];
  
  for (const v of data) {
    if (!allObj[v.id]) {
      allObj[v.id] = {
        title: v.title,
        date: v.date,
        count: 0,
        week: v.week,
      };
    }
    allObj[v.id].count++;
    if (v.owner === id && v.date === today.format("YYYY-MM-DD")) {
      myObj.push({
        title: v.title,
        id: v.id,
        date: v.date,
        _id: v._id.toString(),
        week: v.week,
        owner: "",
        gender: ""
      });
    }
  }

  return {
    all: allObj,
    my: myObj,
    today: today.format("YYYY-MM-DD"),
    gender: gender,
    week: await getApplyStartDate(),
  };
};