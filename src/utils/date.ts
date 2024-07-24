import moment from "moment";

export const checkWeekend = async (date: string): Promise<boolean> => { 
  const m = moment(date, "YYYY-MM-DD");
  return m.day() === 0 || m.day() === 6;
};