import "moment-timezone";
import moment from "moment";

import { UserDB } from "@/app/auth/type";
export { getToday } from "@/app/api/wakeup/utils";

export const WeekDayTime: {
  [key in JasupTime]: {
    start: string;
    end: string;
  };
} = {
  morning: {
    start: "00:00",
    end: "08:50",
  },
  am1: {
    start: "09:00",
    end: "10:20",
  },
  am2: {
    start: "10:40",
    end: "12:00",
  },
  pm1: {
    start: "14:00",
    end: "16:00",
  },
  pm2: {
    start: "16:20",
    end: "18:00",
  },
  night1: {
    start: "19:40",
    end: "21:00",
  },
  night2: {
    start: "21:20",
    end: "23:10",
  },
};

export const getCurrentTime = () => {
  const seoul = moment.tz("Asia/Seoul");
  const endTimes = Object.values(WeekDayTime).map((e) => e.end);
  const currentTime = seoul.format("HH:mm");
  const currentIndex = endTimes.findIndex((e) => e > currentTime);
  if(currentIndex !== -1) return Object.keys(WeekDayTime)[currentIndex] as JasupTime;
  return "morning";
};

export type JasupTime = "morning" | "am1" | "am2" | "pm1" | "pm2" | "night1" | "night2";
export type JasupKoreanTime = "아침" | "오전 1타임" | "오전 2타임" | "오후 1타임" | "오후 2타임" | "야간 1타임" | "야간 2타임";


export type JasupWhere = "none" | "classroom" | "studyroom" | "KTroom" | "etcroom" | "healthroom" | "dormitory" | "outing" | "home";
export type JasupKoreanWhere = "미입실" | "교실" | "열람실" | "KT실" | "기타 특별실" | "보건실" | "생활관" | "외출" | "귀가(결석)";

export const JasupTimeArray: JasupTime[] = ["morning", "am1", "am2", "pm1", "pm2", "night1", "night2"];
export const JasupWhereArray: JasupWhere[] = ["none", "studyroom", "classroom", "KTroom", "etcroom", "healthroom", "dormitory", "outing", "home"];
export const JasupKoreanTimeArray: JasupKoreanTime[] = ["아침", "오전 1타임", "오전 2타임", "오후 1타임", "오후 2타임", "야간 1타임", "야간 2타임"];  
export const JasupKoreanWhereArray: JasupKoreanWhere[] = ["미입실", "열람실", "교실", "KT실", "기타 특별실", "보건실", "생활관", "외출", "귀가(결석)"];

export const englishTimeTypeToKorean = (type: JasupTime) => {
  switch(type) {
  case "morning": return "아침";
  case "am1": return "오전 1타임";
  case "am2": return "오전 2타임";
  case "pm1": return "오후 1타임";
  case "pm2": return "오후 2타임";
  case "night1": return "야간 1타임";
  case "night2": return "야간 2타임";
  }
};
export const koreanTimeTypeToEnglish = (type: JasupKoreanTime) => {
  switch(type) {
  case "아침": return "morning";
  case "오전 1타임": return "am1";
  case "오전 2타임": return "am2";
  case "오후 1타임": return "pm1";
  case "오후 2타임": return "pm2";
  case "야간 1타임": return "night1";
  case "야간 2타임": return "night2";
  }
};
export const englishWhereTypeToKorean = (type: JasupWhere) => {
  switch(type) {
  case "none": return "미입실";
  case "classroom": return "교실";
  case "studyroom": return "열람실";
  case "KTroom": return "KT실";
  case "etcroom": return "기타 특별실";
  case "healthroom": return "보건실";
  case "dormitory": return "생활관";
  case "outing": return "외출";
  case "home": return "귀가(결석)";
  }
};
export const koreanWhereTypeToEnglish = (type: JasupKoreanWhere) => {
  switch(type) {
  case "미입실": return "none";
  case "교실": return "classroom";
  case "열람실": return "studyroom";
  case "KT실": return "KTroom";
  case "기타 특별실": return "etcroom";
  case "보건실": return "healthroom";
  case "생활관": return "dormitory";
  case "외출": return "outing";
  case "귀가(결석)": return "home";
  }
};

export type JasupData = {
  id: UserDB["id"];
  gradeClass: number;
  date: string;
  time: JasupTime;
  type: JasupWhere;
  etc: string;
};

export type JasupDB = JasupData & {
  _id?: string;
};

export type JasupDataWithUser = {
  id: JasupData["id"];
  name: UserDB["name"];
  number: UserDB["number"];
  gender: UserDB["gender"];
  type: JasupData["type"];
  etc: JasupData["etc"];
};