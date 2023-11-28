import moment from "moment";
import "moment-timezone";

import { connectToDatabase } from "@/utils/db";

const fixedData = {
};

const isWeekend = () => {
  const today = moment().tz("Asia/Seoul");

  const day = today.isoWeekday(); // 월(1) ~ 일(7)까지의 값을 반환

  return day === 7 || day === 6;
};

export type StayStates = {
  _id: string;
  isStay: boolean;
  isWasherAvailable: boolean;
  isDryerAvailable: boolean;
  isOpened: boolean[];
  isClassStay: boolean;
  isHosil: boolean;
}
const stayStates = async () => {
  const client = await connectToDatabase();
  const stayCollection = await client.db().collection("states");
  const {
    isStay, washerTime, 
    ...searchStates
  } = await stayCollection.findOne({});
  
  const startHour = washerTime.start[0];
  const startMinute = washerTime.start[1];
  const endHour = washerTime.end[0];
  const endMinute = washerTime.end[1];

  const start = moment().tz("Asia/Seoul");
  start.hour(startHour);
  start.minute(startMinute);
  const end = moment().tz("Asia/Seoul");
  end.hour(endHour);
  end.minute(endMinute);

  const today = moment().tz("Asia/Seoul");

  // today가 start와 end 사이인지 bool
  const isWasherAvailable = today.isBetween(start, end);
  const isDryerAvailable = today.isBetween(start, end);

  const returndata: StayStates = {
    isStay: isWeekend() || isStay,
    isWasherAvailable,
    isDryerAvailable,
    ...searchStates,
    ...fixedData
  };

  return returndata;
};

export default stayStates;
