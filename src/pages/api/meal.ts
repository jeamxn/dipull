import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

import getTokenInfo from "@/utils/getTokenInfo";


const handler = async (
  req: NextApiRequest, 
  res: NextApiResponse
) => {
  const id = (await getTokenInfo(req, res)).id;
  if(!id) {
    res.status(200).json("");
    return;
  }
  if(req.method === "POST") post(req, res, id);
  else if(req.method === "GET") get(req, res, id);
  else if(req.method === "DELETE") del(req, res, id);
};

export type MealReturn = {
  status: string;
  date: string;
  meal: {
    breakfast: string;
    lunch: string;
    dinner: string;
  }
};

const get = async (
  req: NextApiRequest, 
  res: NextApiResponse, 
  id: Number
) => {
  const {date} = req.query;
  if(!date) {
    res.status(400).json({message: "date is required"});
    return;
  }

  try{
    const {data}: {data: MealReturn} = await axios({
      method: "GET",
      url: `https://디미고급식.com/api/${date}`,
    });
	
    res.status(200).json(data);
  }
  catch {
    res.status(400).json({message: "invalid date"});
  }
};

const post = async (
  req: NextApiRequest, 
  res: NextApiResponse, 
  id: Number
) => {
};

const del = async (
  req: NextApiRequest, 
  res: NextApiResponse, 
  id: Number
) => {
};

export default handler;