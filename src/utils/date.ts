import "moment-timezone";
import moment from "moment";

export const checkWeekend = async (date: string): Promise<boolean> => { 
  const m = moment(date, "YYYY-MM-DD");
  return m.day() === 0 || m.day() === 6;
};

export const getWeekStart = async (): Promise<string> => { 
  const m = moment().tz("Asia/Seoul");
  if (m.day() === 0 && m.hour() <= 18) m.subtract(1, "week");
  return m.startOf("week").format("YYYY-MM-DD");
};

const stayApplyTimes = async (): Promise<{
  [key: string]: { day: number; hour: number };
}> => {
  return {
    1: { day: 2, hour: 23 },
    2: { day: 2, hour: 23 },
    3: { day: 1, hour: 23 },
  } as {
    [key: string]: { day: number; hour: number };
  };
};
const homecomingApplyTimes = async (): Promise<{
  [key: string]: { day: number; hour: number };
}> => {
  return {
    1: { day: 2, hour: 23 },
    2: { day: 2, hour: 23 },
    3: { day: 2, hour: 23 },
  } as {
    [key: string]: { day: number; hour: number };
  };
};

const dayKorean = ["일", "월", "화", "수", "목", "금", "토"];

export const stayApplyErrorMessage = async (number: number, type: "stay" | "homecoming" = "stay") => { 
  const grade = Math.floor(number / 1000);
  const avil = await (type === "stay" ? stayApplyTimes : homecomingApplyTimes)();
  const until = avil[grade];
  const korean_day = dayKorean[until.day];
  return `신청 가능한 기간이 아닙니다.\n${grade}학년은 ${korean_day}요일 ${until.hour}시까지만 신청 가능합니다.`;
};

export const isApplyAvail = async (number: number, type: "stay" | "homecoming" = "stay"): Promise<boolean> => {
  const grade = Math.floor(number / 1000);
  const m = moment().tz("Asia/Seoul");
  const avil = await (type === "stay" ? stayApplyTimes : homecomingApplyTimes)();

  const week = moment(await getWeekStart(), "YYYY-MM-DD");
  const end = week.clone().set({
    day: avil[String(grade)].day,
    hour: avil[String(grade)].hour,
  });

  if(m.isBetween(week, end)) return true;
  return false;
};

const machineApplyAvailableTime = async () => ({
  start: {
    hour: 8,
    minute: 0,
  },
  end: {
    hour: 23,
    minute: 0,
  },
});

export const isMachineApplyAvailable = async () => { 
  const m = moment().tz("Asia/Seoul");
  const current = m.clone();
  const avil = await machineApplyAvailableTime();
  const machineStartTime = m.clone().set({
    hour: avil.start.hour,
    minute: avil.start.minute,
  });
  const machineEndTime = m.clone().set({
    hour: avil.end.hour,
    minute: avil.end.minute,
  });
  const isAvail = (
    current.isBetween(machineStartTime, machineEndTime)
    || current.isSame(machineStartTime) || current.isSame(machineEndTime)
  );
  console.log(current.format("HH:mm"), machineStartTime.format("HH:mm"), machineEndTime.format("HH:mm"));
  console.log("isBetween", current.isBetween(machineStartTime, machineEndTime));
  console.log("isSame", current.isSame(machineStartTime), current.isSame(machineEndTime));
  console.log("result", isAvail);
  return isAvail;
};

export const machineApplyEndMessage = async () => {
  const m = moment().tz("Asia/Seoul");
  const avil = await machineApplyAvailableTime();
  const machineStartTime = m.clone().set({
    hour: avil.start.hour,
    minute: avil.start.minute,
  });
  const machineEndTime = m.clone().set({
    hour: avil.end.hour,
    minute: avil.end.minute,
  });
  return `기기 예약 가능 시간이 아닙니다.\n${machineStartTime.format("HH시 mm분")}부터 ${machineEndTime.format("HH시 mm분")}까지만 예약 가능합니다.`;
};