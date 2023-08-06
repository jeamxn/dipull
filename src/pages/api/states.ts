import { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase } from "@/utils/db";
import getTokenInfo from "@/utils/getTokenInfo";
import stayStates, { StayStates } from "@/utils/stayStates";

const handler = async (
  req: NextApiRequest, 
  res: NextApiResponse
) => {
  // const id = (await getTokenInfo(req, res)).id;
  // if(!id) {
  //   res.status(200).json("");
  //   return;
  // }
  const id = 0;
  if(req.method === "POST") post(req, res, id);
  else if(req.method === "GET") get(req, res, id);
  else if(req.method === "DELETE") del(req, res, id);
};

const get = async (
  req: NextApiRequest, 
  res: NextApiResponse, 
  id: Number
) => {
  const stayStatesRow = await stayStates();
  const { _id, ...rec }: StayStates = stayStatesRow;
  res.status(200).json(rec);
};

const post = async (
  req: NextApiRequest, 
  res: NextApiResponse, 
  id: Number
) => {};

const del = async (
  req: NextApiRequest, 
  res: NextApiResponse, 
  id: Number
) => {};

export default handler;