import moment from "moment";
import "moment-timezone";

import { connectToDatabase } from "@/utils/db";

const fixedData = {
};

const isWeekend = () => {
  const today = new Date();
  const day = today.getDay(); // 일(0) ~ 토(6)까지의 값을 반환

  return day === 0 || day === 6;
};

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

  // const today = new Date();
  // const hour = today.getHours();
  // const minute = today.getMinutes();

  const isWasherAvailable = 
    (hour > startHour || (hour === startHour && minute >= startMinute)) 
    && (hour < endHour || (hour === endHour && minute <= endMinute));

  
  const returndata = {
    isStay: isWeekend() || isStay,
    isWasherAvailable,
    ...searchStates,
    ...fixedData
  };

  return returndata;
};

export default stayStates;
