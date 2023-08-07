import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase } from "@/utils/db";

const handler = async (
  req: NextApiRequest, 
  res: NextApiResponse
) => {
  const date = moment().tz("Asia/Seoul");
  if(date.day() !== 0 || date.hour() !== 18) return;

  const client = await connectToDatabase();
  const stayCollection = await client.db().collection("stay");
  stayCollection.deleteMany({});
};

export default handler;