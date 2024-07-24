import "moment-timezone";
import moment from "moment";

export const checkWeekend = async (date: string): Promise<boolean> => { 
  const m = moment(date, "YYYY-MM-DD");
  return m.day() === 0 || m.day() === 6;
};

export const getWeekStart = async (): Promise<string> => { 
  const m = moment().tz("Asia/Seoul");
  return m.startOf("week").format("YYYY-MM-DD");
};