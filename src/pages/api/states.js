import { connectToDatabase } from "@/utils/db";
import getTokenInfo from "@/utils/getTokenInfo";
import stayStates from "@/utils/stayStates";

const handler = async (req, res) => {
  // const id = (await getTokenInfo(req, res)).id;
  // if(!id) {
  //   res.status(200).json("");
  //   return;
  // }
  const id = "";
  if(req.method === "POST") post(req, res, id);
  else if(req.method === "GET") get(req, res, id);
  else if(req.method === "DELETE") del(req, res, id);
};

const get = async (req, res, id) => {
  const stayStatesRow = await stayStates();
  const { _id, ...rec } = stayStatesRow;
  res.status(200).json(rec);
};

const post = async (req, res, id) => {};

const del = async (req, res, id) => {};

export default handler;