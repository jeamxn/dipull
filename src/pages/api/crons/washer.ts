import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase } from "@/utils/db";

const handler = async (
  req: NextApiRequest, 
  res: NextApiResponse
) => {
  const date = moment().tz("Asia/Seoul");
  if(date.hour() !== 0) return;

  const client = await connectToDatabase();
  const washCollection = await client.db().collection("wash");
  washCollection.deleteMany({});
};

export default handler;