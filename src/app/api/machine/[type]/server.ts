"use server";
import "moment-timezone";

import moment from "moment";

import { machineName } from "@/app/(login)/machine/[type]/utils";
import { connectToDatabase } from "@/utils/db";

import { MachineDB, Type, getApplyStartTime, getDefaultValue } from "./utils";

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

export const sendMachineNotification = async (
  type: Type,
  machine: string,
  time: string,
  id: string,
) => {
  const client = await connectToDatabase();
  const timeString = time.replace("오전", "am").replace("오후", "pm").replace("* ", "");
  const timeSet = moment(timeString, "a hh시 mm분");
  const timeMoment30 = timeSet.clone().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss");
  const timeMoment10 = timeSet.clone().subtract(10, "minutes").format("YYYY-MM-DD HH:mm:ss");

  const timeEnd = timeSet.add(type === "dryer" ? 2 : 1, "hours");
  const timeEndMoment10 = timeEnd.clone().subtract(10, "minutes").format("YYYY-MM-DD HH:mm:ss");
  const timeEndMoment5 = timeEnd.clone().subtract(5, "minutes").format("YYYY-MM-DD HH:mm:ss");

  const notificationCollection = client.db().collection("notification");
  const machineTypeKorean = type === "washer" ? "세탁" : "건조";
  const notification_query = {
    id: id,
  };
  const ready = `${machineName(machine)} ${machineTypeKorean}기가 ${time}에 예약되어 있습니다.`;
  const end = `${machineName(machine)} ${machineTypeKorean}기가 ${timeEnd.format("HH시 mm분")}에 종료됩니다.`;
  const notificationK = machineTypeKorean === "세탁" ? "세탁을" : "건조를";
  const notification_querys = [
    {
      ...notification_query,
      payload: {
        title: `30분 후 ${notificationK} 해야 해요!`,
        body: ready,
      },
      type: `machine-${type}-start-30`,
      time: timeMoment30,
    },
    {
      ...notification_query,
      payload: {
        title: `10분 후 ${notificationK} 해야 해요!`,
        body: ready,
      },
      type: `machine-${type}-start-10`,
      time: timeMoment10,
    },
    {
      ...notification_query,
      payload: {
        title: `10분 후 ${machineTypeKorean}기를 빼야 해요!`,
        body: end,
      },
      type: `machine-${type}-end-10`,
      time: timeEndMoment10,
    },
    {
      ...notification_query,
      payload: {
        title: `5분 후 ${machineTypeKorean}기를 빼야 해요!`,
        body: end,
      },
      type: `machine-${type}-end-5`,
      time: timeEndMoment5,
    }
  ];
  await notificationCollection.insertMany(notification_querys);
};

export const deleteMachineNotification = async (
  id: string,
  type: Type
) => { 
  const client = await connectToDatabase();
  const notificationCollection = client.db().collection("notification");
  const notification_query = {
    id: id,
    type: {
      $in: [
        `machine-${type}-start-10`,
        `machine-${type}-start-30`,
        `machine-${type}-end-5`,
        `machine-${type}-end-10`
      ]
    }
  };
  await notificationCollection.deleteMany(notification_query);
};