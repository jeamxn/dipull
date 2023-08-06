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

  const today = moment();
  const [hour, minute] = moment.tz(today, "Asia/Seoul").format("HH:mm").split(":");

  const isWasherAvailable = 
    (hour > startHour || (hour === startHour && minute >= startMinute)) 
    && (hour < endHour || (hour === endHour && minute <= endMinute));

  
  const returndata: StayStates = {
    isStay: isWeekend() || isStay,
    isWasherAvailable,
    ...searchStates,
    ...fixedData
  };

  return returndata;
};

export default stayStates;
