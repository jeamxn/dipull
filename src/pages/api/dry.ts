import moment from "moment";
import "moment-timezone";
import { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase } from "@/utils/db";
import getTokenInfo from "@/utils/getTokenInfo";
import stayStates from "@/utils/stayStates";

type DryerData = {
  [key: string]: {
    grade: number[];
    time: {
      [key: string]: string;
    }
  }
}
const commonDryerData: DryerData = {
  "W1N": {
    grade: [1],
    time: {
      // "오후 6시 35분": "",
      "오후 7시 35분": "",
      // "오후 8시 30분": "",
      "오후 9시 30분": "",
      // "오후 10시 30분": "",
    }
  },
  "W2N": {
    grade: [2],
    time: {
      // "오후 6시 35분": "",
      "오후 7시 35분": "",
      // "오후 8시 30분": "",
      "오후 9시 30분": "",
      // "오후 10시 30분": "",
    }
  },
  "W3N": {
    grade: [3],
    time: {
      // "오후 6시 35분": "",
      "오후 7시 35분": "",
      // "오후 8시 30분": "",
      "오후 9시 30분": "",
      // "오후 10시 30분": "",
    }
  },
  "H2N": {
    grade: [3],
    time: {
      // "오후 6시 35분": "",
      "오후 7시 35분": "",
      // "오후 8시 30분": "",
      "오후 9시 30분": "",
      // "오후 10시 30분": "",
    }
  },
  "H4N": {
    grade: [1, 2],
    time: {
      // "오후 6시 35분": "",
      "오후 7시 35분": "",
      // "오후 8시 30분": "",
      "오후 9시 30분": "",
      // "오후 10시 30분": "",
    }
  },
  "H5N": {
    grade: [2],
    time: {
      // "오후 6시 35분": "",
      "오후 7시 35분": "",
      // "오후 8시 30분": "",
      "오후 9시 30분": "",
      // "오후 10시 30분": "",
    }
  },
};
const stayDryerData: DryerData = {
  "W1N": {
    grade: [1, 2, 3],
    time: {
      // "오후 6시 35분": "",
      "오후 7시 35분": "",
      // "오후 8시 30분": "",
      "오후 9시 30분": "",
      // "오후 10시 30분": "",
      // "* 오후 12시 00분": "",
      "* 오후 1시 00분": "",
    }
  },
  "W2N": {
    grade: [1, 2, 3],
    time: {
      // "오후 6시 35분": "",
      "오후 7시 35분": "",
      // "오후 8시 30분": "",
      "오후 9시 30분": "",
      // "오후 10시 30분": "",
      // "* 오후 12시 00분": "",
      "* 오후 1시 00분": "",
    }
  },
  "W3N": {
    grade: [1, 2, 3],
    time: {
      // "오후 6시 35분": "",
      "오후 7시 35분": "",
      // "오후 8시 30분": "",
      "오후 9시 30분": "",
      // "오후 10시 30분": "",
      // "* 오후 12시 00분": "",
      "* 오후 1시 00분": "",
    }
  },
  "H2N": {
    grade: [1, 2, 3],
    time: {
      // "오후 6시 35분": "",
      "오후 7시 35분": "",
      // "오후 8시 30분": "",
      "오후 9시 30분": "",
      // "오후 10시 30분": "",
      // "* 오후 12시 00분": "",
      "* 오후 1시 00분": "",
    }
  },
  "H4N": {
    grade: [1, 2, 3],
    time: {
      // "오후 6시 35분": "",
      "오후 7시 35분": "",
      // "오후 8시 30분": "",
      "오후 9시 30분": "",
      // "오후 10시 30분": "",
      // "* 오후 12시 00분": "",
      "* 오후 1시 00분": "",
    }
  },
  "H5N": {
    grade: [1, 2, 3],
    time: {
      // "오후 6시 35분": "",
      "오후 7시 35분": "",
      // "오후 8시 30분": "",
      "오후 9시 30분": "",
      // "오후 10시 30분": "",
      // "* 오후 12시 00분": "",
      "* 오후 1시 00분": "",
    }
  },
};

const handler = async (
  req: NextApiRequest, 
  res: NextApiResponse
) => {
  const id = (await getTokenInfo(req, res)).id;
  if(!id) {
    res.status(200).json("");
    return;
  }
  if(req.method === "POST") post(req, res, id);
  else if(req.method === "GET") get(req, res, id);
  else if(req.method === "DELETE") del(req, res, id);
};

type DryCollection = {
  _id: string;
  dryer: string;
  time: string;
  date: string;
  owner: string;
}
type DryerTime = {
  [key: string]: number[]
}
export type DryReturn = {
  dryerData: DryerData;
  myDryerData: DryCollection;
  isDryerAvailable: boolean;
  dryerTime: DryerTime;
}
const get = async (
  req: NextApiRequest, 
  res: NextApiResponse, 
  id: Number
) => {
  const stayStatesRow = await stayStates();
  const dryerData: DryerData = stayStatesRow.isStay ? stayDryerData : commonDryerData;
  const client = await connectToDatabase();
  const dryCollection = client.db().collection("dry");

  const date = moment().tz("Asia/Seoul");
  const year = date.format("YYYY");
  const month = date.format("MM");
  const day = date.format("DD");


  const data: DryCollection[] = await dryCollection.find({
    date: `${year}-${month}-${day}`
  }).toArray();

  const copyDryerData = JSON.parse(JSON.stringify(dryerData));

  data.forEach((item) => {
    if(!copyDryerData[item.dryer].time[item.time]) copyDryerData[item.dryer].time[item.time] = [];
    copyDryerData[item.dryer].time[item.time].push(item.owner);
  });

  const usersCollection = await client.db().collection("users");
  const userInfo = await usersCollection.findOne({ id: Number(id) });
  const mysub: DryCollection = await dryCollection.findOne({ 
    owner: `${userInfo.number} ${userInfo.name}` ,
    date: `${year}-${month}-${day}`
  });

  const statesection = await client.db().collection("states");
  const statesectionRow = await statesection.findOne({ });
  const { dryerTime }: { dryerTime: DryerTime; } = statesectionRow;

  res.status(200).json({
    dryerData: copyDryerData,
    myDryerData: mysub,
    isDryerAvailable: stayStatesRow.isDryerAvailable,
    dryerTime: dryerTime
  });
};

const post = async (
  req: NextApiRequest, 
  res: NextApiResponse, 
  id: Number
) => {
  const stayStatesRow = await stayStates();
  const dryerData = stayStatesRow.isStay ? stayDryerData : commonDryerData;
  const { dryer, time } = req.body;

  if(!stayStatesRow.isDryerAvailable){
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

  if(!dryer || !time) {
    res.status(200).json({
      success: false,
      message: "세탁기와 시간을 선택해주세요."
    });
    return;
  }

  if(dryerData[dryer]?.time[time] === undefined) {
    res.status(200).json({
      success: false,
      message: "혹시 없는 세탁기와 시간을 만들 수 있니?"
    });
    return;
  }

  const client = await connectToDatabase();
  const dryCollection = client.db().collection("dry");
  const usersCollection = await client.db().collection("users");
  const userInfo = await usersCollection.findOne({ id: Number(id) });
  const isISubed = await dryCollection.findOne({ 
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

  const data = await dryCollection.find({
    date: `${year}-${month}-${day}`,
    dryer: dryer,
    time: time
  }).toArray();

  if(data.length > 0) {
    res.status(200).json({
      success: false,
      message: "이미 예약된 세탁기입니다."
    });
    return;
  }

  if(dryer[0] === "W" && userInfo.gender !== "female") {
    res.status(200).json({
      success: false,
      message: "혹시 여자이신가요?"
    });
    return;
  }
  else if(dryer[0] === "H" && userInfo.gender !== "male") {
    res.status(200).json({
      success: false,
      message: "혹시 남자이신가요?"
    });
    return;
  }

  if(!dryerData[dryer].grade.includes(Math.floor(userInfo.number / 1000))) {
    res.status(200).json({
      success: false,
      message: "님 나이 조작함?"
    });
    return;
  }

  const { _id, ...rest } = await dryCollection.insertOne({
    dryer: dryer,
    time: time,
    date: `${year}-${month}-${day}`,
    owner: `${userInfo.number} ${userInfo.name}`
  });

  res.status(200).json({
    success: true,
    message: "예약되었습니다."
  });
};

const del = async (
  req: NextApiRequest, 
  res: NextApiResponse, 
  id: Number
) => {
  try{
    const date = moment().tz("Asia/Seoul");
    const year = date.format("YYYY");
    const month = date.format("MM");
    const day = date.format("DD");

    const client = await connectToDatabase();
    const dryCollection = client.db().collection("dry");
    const usersCollection = await client.db().collection("users");
    const userInfo = await usersCollection.findOne({ id: Number(id) });
    const mysub = await dryCollection.deleteOne({ 
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