"use server";

import { connectToDatabase } from "@/utils/db";

import { JasupBookDB } from "../utils";

export const getJasupBook = async (id: string) => { 
  const client = await connectToDatabase();
  const jasupBookCollection = client.db().collection<JasupBookDB>("jasup_book");
  const my: JasupBookDB[] = await jasupBookCollection.find({ id: id }).toArray();
  return my;
};