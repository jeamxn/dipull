"use server";

import { getApplyStartDate } from "@/app/api/stay/utils";
import { connectToDatabase } from "@/utils/db";

import { OutingDB, defaultOutingData } from "./utils";

export const getOuting = async (id: string) => { 
  const client = await connectToDatabase();
  const outingCollection = client.db().collection("outing");
  const query = { owner: id, week: await getApplyStartDate() };
  const result = await outingCollection.findOne(query) as unknown as OutingDB | null;
  return result ? {
    sat: result.sat,
    sun: result.sun,
  } : {
    sat: defaultOutingData,
    sun: defaultOutingData,
  };
};