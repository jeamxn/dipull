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

const stayApplyTimes: {
  [key: string]: { day: number; hour: number };
} = {
  1: { day: 2, hour: 23 },
  2: { day: 2, hour: 23 },
  3: { day: 1, hour: 23 },
};

const dayKorean = ["일", "월", "화", "수", "목", "금", "토"];

export const stayApplyErrorMessage = (number: number): string => { 
  const grade = Math.floor(number / 1000);
  const until = stayApplyTimes[grade];
  const korean_day = dayKorean[until.day];
  return `신청 가능한 기간이 아닙니다.\n${grade}학년은 ${korean_day}요일 ${until.hour}시까지만 신청 가능합니다.`;
};

export const isApplyEnd = async (number: number): Promise<boolean> => {
  const grade = Math.floor(number / 1000);
  const m = moment().tz("Asia/Seoul");
  if (
    (m.day() === stayApplyTimes[String(grade)].day && m.hour() >= stayApplyTimes[String(grade)].hour)
      || m.day() > stayApplyTimes[String(grade)].day
  ) return true;
  return false;
};