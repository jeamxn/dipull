import stayStates from "@/pages/api/utils/stayStates";
import { connectToDatabase } from "@/utils/db";
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
  const stayStatesRow = await stayStates();

  const client = await connectToDatabase();
  const stayCollection = await client.db().collection("stay");
  const usersCollection = await client.db().collection("users");
  const userInfo = await usersCollection.findOne({ id: Number(id) });
  const name = `${userInfo.number} ${userInfo.name}`;

  const searchMyData = await stayCollection.findOne({ name });
  if(!searchMyData) {
    res.status(200).json({
      success: false,
      message: "잔류 신청을 하지 않았습니다.",
      isOpened: stayStatesRow.isOpened[Math.floor(userInfo.number / 1000) - 1]
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "잔류 신청을 하였습니다.",
    data: searchMyData.outing,
    isOpened: stayStatesRow.isOpened[Math.floor(userInfo.number / 1000) - 1]
  });
};

const post = async (req, res, id) => {
  const { type, reason, meal } = req.body;
  const stayStatesRow = await stayStates();

  if(!type || !reason || !meal) {
    res.status(200).json({
      success: false,
      message: "잘못된 요청입니다."
    });
    return;
  }

  const client = await connectToDatabase();
  const stayCollection = await client.db().collection("stay");
  const usersCollection = await client.db().collection("users");
  const userInfo = await usersCollection.findOne({ id: Number(id) });
  const name = `${userInfo.number} ${userInfo.name}`;

  if(!stayStatesRow.isOpened[Math.floor(userInfo.number / 1000) - 1]) {
    res.status(200).json({
      success: false,
      message: "잔류(외출) 신청 기간이 아닙니다."
    });
    return;
  }

  const update = await stayCollection.updateOne({ name }, {
    $set: {
      [`outing.${type}.meal`]: meal
    },
    $push: {
      [`outing.${type}.reason`]: reason
    }
  });

  if(update.modifiedCount){
    res.status(200).json({
      success: true,
      message: "신청되었습니다."
    });
    return;
  }

  res.status(200).json({
    success: false,
    message: "외출 신청 실패~!"
  });
};

const del = async (req, res, id) => {};

export default handler;