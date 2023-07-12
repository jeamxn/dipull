import axios from "axios";

import getTokenInfo from "@/utils/getTokenInfo";


const handler = async (req, res) => {
  const id = (await getTokenInfo(req, res)).id;
  if(!id) {
    res.status(200).json("");
    return;
  }
  if(req.method === "POST") post(req, res, id);
  else if(req.method === "GET") get(req, res, id);
  else if(req.method === "DELETE") del(req, res, id);
};

const get = async (req, res, id) => {
  const {grade, class: class_} = req.query;

  try{
    const {data} = await axios.get("https://api.2w.vc/comcigan/getTimetable/29175");
    const d = data.data[grade][class_].map(v1 => v1.map(v2 => ({
      subject: v2.subject,
      teacher: v2.teacher,
    })));
    const dByTime = [];
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

const post = async (req, res, id) => {
};

const del = async (req, res, id) => {
};

export default handler;