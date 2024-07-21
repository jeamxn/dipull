"use server";

import moment from "moment";

import { connectToDatabase } from "@/utils/db";

import "moment-timezone";
import { getApplyStartDate } from "../../stay/utils";

import { defaultWakeupAvail } from "./utils";
[];
export const getWakeupAvail = async (id: string) => {
  const client = await connectToDatabase();
  const wakeupAplyCollection = client.db().collection("wakeup_aply");
  const today = await getApplyStartDate();
  const find = await wakeupAplyCollection.findOne({
    owner: id,
    // date: today,
  });

  if (!find) {
    const newData = {
      owner: id,
      // date: today,
      available: defaultWakeupAvail,
    };
    await wakeupAplyCollection.insertOne(newData);
    return newData;
  }
  else return {
    owner: find.owner,
    // date: find.date,
    available: find.available,
  };
};