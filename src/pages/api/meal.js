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
  const {date} = req.query;
  if(!date) {
    res.status(400).json({message: "date is required"});
    return;
  }

  try{
    const {data} = await axios({
      method: "GET",
      url: `https://디미고급식.com/api/${date}`,
    });
	
    console.log(data, date);
	
    res.status(200).json(data);
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