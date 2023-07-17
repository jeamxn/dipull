import { connectToDatabase } from "@/utils/db";
import getTokenInfo from "@/utils/getTokenInfo";
import stayStates from "@/utils/stayStates";

const handler = async (req, res) => {
  const tokenInfo = await getTokenInfo(req, res);
  const { id } = tokenInfo;
  if(!id) {
    res.status(200).json("");
    return;
  }

  const client = await connectToDatabase();
  const usersCollection = await client.db().collection("users");
  const user = await usersCollection.findOne({ id: Number(id) });

  if(!user?.admin) {
    res.status(200).json({
      success: false,
      message: "관리자만 접근 가능합니다."
    });
    return;
  }

  if(req.method === "POST") post(req, res, id);
  else if(req.method === "GET") get(req, res, id);
  else if(req.method === "DELETE") del(req, res, id);
};

const get = async (req, res, id) => {};

const post = async (req, res, id) => {
  const { type, reason, meal, number, name } = req.body;

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
  const userInfo = await usersCollection.findOne({ 
    number: Number(number),
    name: name
  });

  if(!userInfo) {
    res.status(200).json({
      success: false,
      message: "해당하는 학생이 없습니다."
    });
    return;
  }

  const info_name = `${userInfo.number} ${userInfo.name}`;

  const update = await stayCollection.updateOne({ name: info_name }, {
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