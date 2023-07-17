import stayStates from "@/pages/api/utils/stayStates";
import { connectToDatabase } from "@/utils/db";
import getTokenInfo from "@/utils/getTokenInfo";
import classStay from "@/utils/seatData/classStay";
import readingRoomStay from "@/utils/seatData/readingRoomStay";


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
  const { number, name, oldSelect, newSelect } = req.body;
  console.log(req.body);

  if(!number || !name) {
    res.status(200).json({
      success: false,
      message: "학번 이름을 입력해주세요."
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

  if(oldSelect) {
    const deleteOlder = await stayCollection.deleteOne({
      seat: String(oldSelect).toUpperCase(),
      name: `${userInfo.number} ${userInfo.name}`
    });
    if(deleteOlder.deletedCount === 0) {
      res.status(200).json({
        success: false,
        message: "기존 좌석과 학생이 일치하지 않습니다."
      });
      return;
    }
  }

  if(newSelect) {
    const insertNew = await stayCollection.insertOne({
      seat: String(newSelect).toUpperCase(),
      name: `${userInfo.number} ${userInfo.name}`,
      gender: userInfo.gender,
      outing: {
        "토요일": {
          "reason": [],
          "meal": [true, true, true]
        },
        "일요일": {
          "reason": [],
          "meal": [true, true, true]
        },
      }
    });
    if(insertNew.insertedCount === 0) {
      res.status(200).json({
        success: false,
        message: "신청 실패"
      });
      return;
    }
  }

  res.status(200).json({
    success: true,
    message: "신청 또는 수정 되었습니다."
  });
};

const del = async (req, res, id) => {};

export default handler;