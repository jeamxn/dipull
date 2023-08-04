import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

import getTokenInfo from "@/utils/getTokenInfo";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = (await getTokenInfo(req, res)).id;
  if(!id) {
    res.status(200).json("");
    return;
  }
  if(req.method === "POST") post(req, res, id);
  else if(req.method === "GET") get(req, res, id);
  else if(req.method === "DELETE") del(req, res, id);
};

type D = {
  teacher: String;
  subject: String;
};
type ComsiganData = {
  status: string,
  data: {
    [grade: string]: {
      [class_: string]: D[][];
    }
  }
};

const get = async (
  req: NextApiRequest,
  res: NextApiResponse,
  id: Number
) => {
  const {grade, class: class_} = req.query as {grade: string, class: string};

  try{
    const {data} = await axios.get("https://api.2w.vc/comcigan/getTimetable/29175") as {data: ComsiganData};
    const d: D[][] = data.data[grade][class_].map(v1 => {
      const v1Map: D[] = v1.map(v2 => {
        const v2Map: D = {
          subject: v2.subject,
          teacher: v2.teacher,
        };
        return v2Map;
      });
      return v1Map;
    });
    const dByTime: D[][] = [];
    for(let i = 0; i < 7; i++) {
      dByTime.push([]);
      for(let j = 0; j < 5; j++) {
        dByTime[i].push(d[j][i]);
      }
    }
    res.status(200).json(dByTime);
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