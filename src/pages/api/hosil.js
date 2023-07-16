import { connectToDatabase } from "@/utils/db";
import getTokenInfo from "@/utils/getTokenInfo";
import classStay from "@/utils/seatData/classStay";
import readingRoomStay from "@/utils/seatData/readingRoomStay";
import stayStates from "@/utils/stayStates";


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
  const client = await connectToDatabase();
  const hosilCollection = await client.db().collection("hosil");
  const usersCollection = await client.db().collection("users");
  const userInfo = await usersCollection.findOne({ id: Number(id) });
  const name = `${userInfo.number} ${userInfo.name}`;
  const rowData = await hosilCollection.find({}).toArray();

  const rtn = {};

  for(const row of rowData) {
    const { hosil, num, name } = row;
    if(!rtn[hosil]) rtn[hosil] = [];
    rtn[hosil][num] = name;
  }

  const mySelect = await hosilCollection.find({
    name
  }).toArray();

  res.status(200).json({
    rtn,
    mySelect: mySelect.length > 0
  });
};

const post = async (req, res, id) => {
  const stayStatesRow = await stayStates();
  if(!stayStatesRow.isHosil) {
    res.status(200).json({
      success: false,
      message: "선호 호실 신청/수정 기간이 아닙니다."
    });
    return;
  }

  const client = await connectToDatabase();
  const hosilCollection = await client.db().collection("hosil");
  const usersCollection = await client.db().collection("users");
  const userInfo = await usersCollection.findOne({ id: Number(id) });
  const name = `${userInfo.number} ${userInfo.name}`;

  const { hosil, num } = req.body;

  const rowData = await hosilCollection.find({
    hosil,
    num
  }).toArray();
  if(rowData.length > 0){
    res.status(200).json({
      success: false,
      message: "이미 신청된 호실 번호입니다."
    });
    return;
  }

  const mySelect = await hosilCollection.find({
    name
  }).toArray();
  if(mySelect.length > 0){
    const updateOne = await hosilCollection.updateOne({
      name
    }, {
      $set: {
        hosil,
        num
      }
    });
    res.status(200).json({
      success: true,
      message: "선호 호실 변경되었습니다.",
    });
    return;
  }

  const insertOne = await hosilCollection.insertOne({
    hosil,
    num,
    name
  });
  
  res.status(200).json({
    success: true,
    message: "선호 호실 신청되었습니다.",
  });
};

const del = async (req, res, id) => {
  const stayStatesRow = await stayStates();
  if(!stayStatesRow.isHosil) {
    res.status(200).json({
      success: false,
      message: "선호 호실 신청/수정 기간이 아닙니다."
    });
    return;
  }
  
  const client = await connectToDatabase();
  const hosilCollection = await client.db().collection("hosil");
  const usersCollection = await client.db().collection("users");
  const userInfo = await usersCollection.findOne({ id: Number(id) });
  const name = `${userInfo.number} ${userInfo.name}`;

  const deleteOne = await hosilCollection.deleteOne({
    name
  });

  res.status(200).json({
    success: true,
    message: "선호 호실 신청이 취소되었습니다.",
  });
};

export default handler;