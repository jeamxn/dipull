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
  const stayStatesRow = await stayStates();
  const seatDatas = stayStatesRow.isClassStay ? classStay : readingRoomStay;

  const client = await connectToDatabase();
  const stayCollection = await client.db().collection("stay");
  const rowData = await stayCollection.find({}).toArray();

  const data = rowData.map((row) => {
    const { _id, ...rest } = row;
    return rest;
  });

  const students = {
    "1": {
      "1": {
        "male": [],
        "female": []
      },
      "2": {
        "male": [],
        "female": []
      },
      "3": {
        "male": [],
        "female": []
      },
      "4": {
        "male": [],
        "female": []
      },
      "5": {
        "male": [],
        "female": []
      },
      "6": {
        "male": [],
        "female": []
      },
    }, 
    "2": {
      "1": {
        "male": [],
        "female": []
      },
      "2": {
        "male": [],
        "female": []
      },
      "3": {
        "male": [],
        "female": []
      },
      "4": {
        "male": [],
        "female": []
      },
      "5": {
        "male": [],
        "female": []
      },
      "6": {
        "male": [],
        "female": []
      },
    }, 
    "3": {
      "1": {
        "male": [],
        "female": []
      },
      "2": {
        "male": [],
        "female": []
      },
      "3": {
        "male": [],
        "female": []
      },
      "4": {
        "male": [],
        "female": []
      },
      "5": {
        "male": [],
        "female": []
      },
      "6": {
        "male": [],
        "female": []
      },
    }, 
  };

  const seatData = {};
  data.forEach((row) => {
    const { seat, ...rem } = row;
    if(seat !== "#0") {
      seatData[seat] = rem;
    }
    
    const gc = Number(row.name.split(" ")[0]);
    const _name = row.name.split(" ")[1];
    const _grade = Math.floor(gc / 1000);
    const _class = Math.floor(gc / 100) - (_grade * 10);
    const _gender = row.gender;
    students[_grade][_class][_gender].push(_name);
  });

  const usersCollection = await client.db().collection("users");
  const userInfo = await usersCollection.findOne({ id: Number(id) });
  const mysub = await stayCollection.findOne({ name: `${userInfo.number} ${userInfo.name}` });

  res.status(200).json({
    myStay: mysub,
    seat: seatData,
    isClassStay: stayStatesRow.isClassStay,
    seatData: seatDatas,
    students: students,
    isOpened: stayStatesRow.isOpened[Math.floor(userInfo.number / 1000) - 1]
  });
};

const post = async (req, res, id) => {
  let { seat } = req.body;

  const stayStatesRow = await stayStates();
  const seatDatas = stayStatesRow.isClassStay ? classStay : readingRoomStay;

  if(!seat && !stayStatesRow.isClassStay) {
    res.status(200).json({
      success: false,
      message: "좌석을 선택해주세요."
    });
    return;
  }
  else if(!seat){
    seat = "#0";
  }
  
  const client = await connectToDatabase();
  const stayCollection = await client.db().collection("stay");
  const usersCollection = await client.db().collection("users");
  const userInfo = await usersCollection.findOne({ id: Number(id) });
  const name = `${userInfo.number} ${userInfo.name}`;
  const gender = userInfo.gender;

  if(!stayStatesRow.isOpened[Math.floor(userInfo.number / 1000) - 1]) {
    res.status(200).json({
      success: false,
      message: "잔류(외출) 신청 기간이 아닙니다."
    });
    return;
  }

  const rowData = await stayCollection.find({
    seat: seat
  }).toArray();

  if(rowData.length > 0 && seat !== "#0") {
    res.status(200).json({
      success: false,
      message: "이미 신청된 좌석입니다."
    });
    return;
  }


  for(const e of seatDatas) {
    if(!e.seat[seat[0]]?.includes(Number(seat.slice(1, 3)))) continue;
    if(e.gender !== gender) {
      res.status(200).json({
        success: false,
        message: "성별이 맞지 않습니다."
      });
      return;
    }
  }

  const searchUser = await stayCollection.find({ name: name }).toArray();
  if(searchUser.length > 0) {
    res.status(200).json({
      success: false,
      message: "이미 잔류 신청 했습니다."
    });
    return;
  }

  const insertOne = await stayCollection.insertOne({ 
    seat: String(seat).toUpperCase(), 
    name, 
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
  res.status(200).json({
    success: true,
    message: "신청되었습니다."
  });
};

const del = async (req, res, id) => {
  const stayStatesRow = await stayStates();

  try{
    const client = await connectToDatabase();
    const stayCollection = client.db().collection("stay");
    const usersCollection = await client.db().collection("users");
    const userInfo = await usersCollection.findOne({ id: Number(id) });
    const mysub = await stayCollection.deleteOne({ name: `${userInfo.number} ${userInfo.name}` });
  
    if(!stayStatesRow.isOpened[Math.floor(userInfo.number / 1000) - 1]) {
      res.status(200).json({
        success: false,
        message: "잔류(외출) 신청 기간이 아닙니다."
      });
      return;
    }

    if(mysub.deletedCount){
      res.status(200).json({
        success: true,
        message: "잔류 취소되었습니다.",
      });
    }
  }
  catch{
    res.status(200).json({
      success: true,
      message: "잔류 취소 실패~~!~!"
    });
  }
};

export default handler;