import "moment-timezone";
import moment from "moment";

export const checkWeekend = async (date: string): Promise<boolean> => { 
  const m = moment(date, "YYYY-MM-DD");
  return m.day() === 0 || m.day() === 6;
};

export const getWeekStart = async (): Promise<string> => { 
  const m = moment().tz("Asia/Seoul");
  if (m.day() === 0 && m.hour() >= 18) m.subtract(1, "week");
  return m.startOf("week").format("YYYY-MM-DD");
};

export const isApplyEnd = async (number: number): Promise<boolean> => {
  const grade = Math.floor(number / 1000);
  const m = moment().tz("Asia/Seoul");
  const times: {
    [key: string]: { day: number; hour: number };
  } = {
    1: { day: 2, hour: 23 },
    2: { day: 2, hour: 23 },
    3: { day: 1, hour: 23 },
  };
  if (
    (m.day() === times[String(grade)].day && m.hour() >= times[String(grade)].hour)
      || m.day() > times[String(grade)].day
  ) return true;
  return false;
};