import moment from "moment";
import "moment-timezone";

import { connectToDatabase } from "@/utils/db";
import getTokenInfo from "@/utils/getTokenInfo";
import stayStates from "@/utils/stayStates";

const commonWasherData = {
  "W1N": {
    grade: [1],
    time: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
    }
  },
  "W2N": {
    grade: [2],
    time: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
    }
  },
  "W3N": {
    grade: [3],
    time: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
    }
  },
  "H2R": {
    grade: [1],
    time: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
    }
  },
  "H4L": {
    grade: [1],
    time: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
    }
  },
  "H4R": {
    grade: [2],
    time: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
    }
  },
  "H5N": {
    grade: [2],
    time: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
    }
  },
  "H2C": {
    grade: [3],
    time: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
    }
  },
  "H2L": {
    grade: [3],
    time: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
    }
  }
};
const stayWasherData = {
  "W1N": {
    grade: [1, 2, 3],
    time: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
      // "* 오후 12시 00분": "",
      // "* 오후 1시 00분": "",
    }
  },
  "W2N": {
    grade: [1, 2, 3],
    time: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
      // "* 오후 12시 00분": "",
      // "* 오후 1시 00분": "",
    }
  },
  "W3N": {
    grade: [1, 2, 3],
    time: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
      // "* 오후 12시 00분": "",
      // "* 오후 1시 00분": "",
    }
  },
  "H2R": {
    grade: [1, 2, 3],
    time: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
      // "* 오후 12시 00분": "",
      // "* 오후 1시 00분": "",
    }
  },
  "H4L": {
    grade: [1, 2, 3],
    time: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
      // "* 오후 12시 00분": "",
      // "* 오후 1시 00분": "",
    }
  },
  "H4R": {
    grade: [1, 2, 3],
    time: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
      // "* 오후 12시 00분": "",
      // "* 오후 1시 00분": "",
    }
  },
  "H5N": {
    grade: [1, 2, 3],
    time: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
      // "* 오후 12시 00분": "",
      // "* 오후 1시 00분": "",
    }
  },
  "H2C": {
    grade: [1, 2, 3],
    time: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
      // "* 오후 12시 00분": "",
      // "* 오후 1시 00분": "",
    }
  },
  "H2L": {
    grade: [1, 2, 3],
    time: {
      "오후 6시 35분": "",
      "오후 7시 35분": "",
      "오후 8시 30분": "",
      "오후 9시 30분": "",
      "오후 10시 30분": "",
      // "* 오후 12시 00분": "",
      // "* 오후 1시 00분": "",
    }
  }
};

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
  const washerData = stayStatesRow.isStay ? stayWasherData : commonWasherData;
  const client = await connectToDatabase();
  const washCollection = client.db().collection("wash");

  const date = moment().tz("Asia/Seoul");
  const year = date.format("YYYY");
  const month = date.format("MM");
  const day = date.format("DD");

  const data = await washCollection.find({
    date: `${year}-${month}-${day}`
  }).toArray();

  const copyWasherData = JSON.parse(JSON.stringify(washerData));

  data.forEach((item) => {
    if(!copyWasherData[item.washer].time[item.time]) copyWasherData[item.washer].time[item.time] = [];
    copyWasherData[item.washer].time[item.time].push(item.owner);
  });

  const usersCollection = await client.db().collection("users");
  const userInfo = await usersCollection.findOne({ id: Number(id) });
  const mysub = await washCollection.findOne({ 
    owner: `${userInfo.number} ${userInfo.name}` ,
    date: `${year}-${month}-${day}`
  });

  const statesection = await client.db().collection("states");
  const statesectionRow = await statesection.findOne({ });
  const {washerTime} = statesectionRow;

  res.status(200).json({
    washerData: copyWasherData,
    myWasherData: mysub,
    isWasherAvailable: stayStatesRow.isWasherAvailable,
    washerTime: washerTime
  });
};

const post = async (req, res, id) => {
  const stayStatesRow = await stayStates();
  const washerData = stayStatesRow.isStay ? stayWasherData : commonWasherData;
  const { washer, time } = req.body;

  if(!stayStatesRow.isWasherAvailable){
    res.status(200).json({
      success: false,
      message: "세탁 신청 시간이 아닙니다."
    });
    return;
  }

  const date = moment().tz("Asia/Seoul");
  const year = date.format("YYYY");
  const month = date.format("MM");
  const day = date.format("DD");

  if(!washer || !time) {
    res.status(200).json({
      success: false,
      message: "세탁기와 시간을 선택해주세요."
    });
    return;
  }

  if(washerData[washer]?.time[time] === undefined) {
    res.status(200).json({
      success: false,
      message: "혹시 없는 세탁기와 시간을 만들 수 있니?"
    });
    return;
  }

  const client = await connectToDatabase();
  const washCollection = client.db().collection("wash");
  const usersCollection = await client.db().collection("users");
  const userInfo = await usersCollection.findOne({ id: Number(id) });
  const isISubed = await washCollection.findOne({ 
    owner: `${userInfo.number} ${userInfo.name}`,
    date: `${year}-${month}-${day}`
  });
  if(isISubed) {
    res.status(200).json({
      success: false,
      message: "이미 예약한 세탁기가 있습니다."
    });
    return;
  }

  const data = await washCollection.find({
    date: `${year}-${month}-${day}`,
    washer: washer,
    time: time
  }).toArray();

  if(data.length > 0) {
    res.status(200).json({
      success: false,
      message: "이미 예약된 세탁기입니다."
    });
    return;
  }

  if(washer[0] === "W" && userInfo.gender !== "female") {
    res.status(200).json({
      success: false,
      message: "혹시 여자이신가요?"
    });
    return;
  }
  else if(washer[0] === "H" && userInfo.gender !== "male") {
    res.status(200).json({
      success: false,
      message: "혹시 남자이신가요?"
    });
    return;
  }

  if(!washerData[washer].grade.includes(Math.floor(userInfo.number / 1000))) {
    res.status(200).json({
      success: false,
      message: "님 나이 조작함?"
    });
    return;
  }

  const { _id, ...rest } = await washCollection.insertOne({
    washer: washer,
    time: time,
    date: `${year}-${month}-${day}`,
    owner: `${userInfo.number} ${userInfo.name}`
  });

  res.status(200).json({
    success: true,
    message: "예약되었습니다."
  });
};

const del = async (req, res, id) => {
  try{
    const date = moment().tz("Asia/Seoul");
    const year = date.format("YYYY");
    const month = date.format("MM");
    const day = date.format("DD");

    const client = await connectToDatabase();
    const washCollection = client.db().collection("wash");
    const usersCollection = await client.db().collection("users");
    const userInfo = await usersCollection.findOne({ id: Number(id) });
    const mysub = await washCollection.deleteOne({ 
      owner: `${userInfo.number} ${userInfo.name}`,
      date: `${year}-${month}-${day}`
    });
  
    if(mysub.deletedCount){
      res.status(200).json({
        success: true,
        message: "예약이 취소되었습니다.",
      });
    }
  }
  catch{
    res.status(200).json({
      success: true,
      message: "예약이 취소 실패~~!~!"
    });
  }
};


export default handler;