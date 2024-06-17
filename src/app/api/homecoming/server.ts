"use server";

import { connectToDatabase } from "@/utils/db";

import { getApplyStartDate } from "../stay/utils";

import { HomecomingDB } from "./utils";

export const getHomecoming = async (id: string) => { 
  const client = await connectToDatabase();
  const homecomingCollection = client.db().collection("homecoming");
  const my = { id: id, week: await getApplyStartDate() };
  const data = await homecomingCollection.findOne(my) as unknown as HomecomingDB;
  return {
    id: data?._id || id,
    reason: data?.reason || "",
    time: data?.time || "",
  };
};