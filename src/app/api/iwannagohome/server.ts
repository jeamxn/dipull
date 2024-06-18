"use server";

import { getApplyStartDate } from "@/app/api/stay/utils";
import { connectToDatabase } from "@/utils/db";

import { IwannagohomeDB } from "./utils";

export const getIwannagohome = async (id: string) => {
  const client = await connectToDatabase();
  const iwannagohomeCollection = client.db().collection("iwannagohome");
  const date = await getApplyStartDate();
  const myData = await iwannagohomeCollection.findOne({ id: id, date: date }) as unknown as IwannagohomeDB;
  const count = [0, 0];
  const all = await iwannagohomeCollection.find({ date: date }).toArray();
  all.length && all.forEach((v) => {
    count[v.pick]++;
  });

  return {
    my: myData?.pick,
    count,
    date,
  };
};