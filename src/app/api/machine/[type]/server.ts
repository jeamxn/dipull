"use server";
import "moment-timezone";

import moment from "moment";

import { connectToDatabase } from "@/utils/db";

import { MachineDB, getApplyStartTime, getDefaultValue } from "./utils";

type Data = {
  booked: boolean;
  info: MachineDB;
};

export const getMachineData = async (type: "washer" | "dryer", userId: string, showAll: boolean = false) => {
  const client = await connectToDatabase();
  const machineCollection = client.db().collection("machine");
  const query = { type: type, date: moment().tz("Asia/Seoul").format("YYYY-MM-DD") };
  const aggregationPipeline = [
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "id",
        as: "userInfo"
      }
    },
    {
      $unwind: "$userInfo"
    },
    {
      $project: {
        _id: 0,
        id: "$owner",
        name: "$userInfo.name",
        number: "$userInfo.number",
        machine: "$machine",
        time: "$time",
        date: "$date",
        type: "$type",
      }
    },
    {
      $match: query
    }
  ];
  const result = await machineCollection.aggregate(aggregationPipeline).toArray();

  const isStay = moment().tz("Asia/Seoul").day() === 0 || moment().tz("Asia/Seoul").day() === 6;

  const defaultData = await getDefaultValue(type, isStay);
  const currentTime = moment(moment().tz("Asia/Seoul").format("HH:mm"), "HH:mm");
  const applyStartDate = moment(await getApplyStartTime(), "HH:mm");
  if (currentTime.isSameOrAfter(applyStartDate)) {
    for (const item of result) {
      defaultData[item.machine].time[item.time] = `${item.number} ${item.name}`;
    }
  }

  const myBookQuery = { type: type, date: moment().tz("Asia/Seoul").format("YYYY-MM-DD"), owner: userId };
  const myBook = await machineCollection.findOne(myBookQuery) as unknown as MachineDB || null;

  const fullData: Data = {
    booked: true,
    info: myBook,
  };
  const nullData: Data = {
    booked: false,
    info: {
      machine: "",
      time: "",
      date: "",
      owner: "",
      type: type,
    }
  };

  const myBookData: {
    booked: boolean;
    info: MachineDB;
  } = (currentTime.isSameOrAfter(applyStartDate) || showAll) && myBook ? fullData : nullData;
  
  return { defaultData, myBookData };
};