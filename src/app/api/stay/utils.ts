import "moment-timezone";
import moment from "moment";

import { UserDB } from "@/app/auth/type";
import { getStates } from "@/utils/getStates";

export type StayData = {
  week: string;
  seat: string;
  owner: string;
}

export type StayDB = StayData & {
  _id: string;
}

export type BySeatsObj = {
  [key: string]: {
    [key: string]: string;
  };
}

export type GradeClassInner = {
  id: UserDB["id"],
  name: UserDB["name"],
  number: UserDB["number"],
  gender: UserDB["gender"],
  seat: StayDB["seat"],
  week: StayDB["week"],
}

export type ByGradeClassObj = {
  [key: string]: {
    [key: string]: GradeClassInner[];
  }
}

export type StayGetResponse = {
  message: string;
  data: {
    bySeatsObj: BySeatsObj;
    byGradeClassObj: ByGradeClassObj;
    mySelect: string;
    studyroom: StudyroomData[];
    classStay: {
      1: boolean;
      2: boolean;
      3: boolean;
    }
  };
  query: {
      week: string;
  };
};

export type StudyroomData = {
  color: string;
  grade: number;
  gender: string;
  seat: {
    [key: string]: number[];
  }
}

export type StudyroomDB = StudyroomData & {
  _id: string;
}

export const getApplyStartDate = async () => {
  const states = await getStates("stay");
  if(states?.start) {
    return moment(states.start).format("YYYY-MM-DD");
  }
  const seoul = moment().tz("Asia/Seoul").startOf("week");
  const today = moment().tz("Asia/Seoul");
  if(today.day() === 0 && today.hour() < 18) {
    return seoul.subtract(7, "day").format("YYYY-MM-DD");
  }
  return seoul.format("YYYY-MM-DD");
};

export const getApplyEndDate = async () => {
  const states = await getStates("stay");
  if(states?.end) {
    return moment(states.end).format("YYYY-MM-DD");
  }
  return moment(await getApplyStartDate()).add(2, "day").format("YYYY-MM-DD");
};

const koreanDay = ["일", "월", "화", "수", "목", "금", "토"];

const msgMaker = (msg: string, start: moment.Moment, end: moment.Moment) => {
  if(start.isSame(end, "day")) return `${msg}\n이번 주는 ${koreanDay[start.day()]}요일에만 신청 가능합니다.`;
  return `${msg}\n이번 주는 ${koreanDay[start.day()]}요일부터 ${koreanDay[end.day()]}요일까지 신청 가능합니다.`;
};
export const isStayApplyNotPeriod = async (number: number) => {
  const states = await getStates("stay");
  const grade = Math.floor(number / 1000);
  const currentTime = moment(moment().tz("Asia/Seoul").format("YYYY-MM-DD"), "YYYY-MM-DD");
  const applyStartDate = moment(await getApplyStartDate());
  const applyEndDate = moment(await getApplyEndDate());
  if(currentTime.isBefore(applyStartDate) || currentTime.isAfter(applyEndDate)) {
    return msgMaker("잔류 신청 기간이 아닙니다.", applyStartDate, applyEndDate);
  }
  const addDate = states?.grade3Add === undefined ? 1 : states.grade3Add;
  const subtractDate = states?.grade12Subtract === undefined ? 1 : states.grade12Subtract;
  const addOneFromStartDate = applyStartDate.add(addDate, "day");
  const subtractOneFromEndDate = applyEndDate.subtract(subtractDate, "day");
  if(grade === 3 && currentTime.isAfter(addOneFromStartDate)) {
    return msgMaker("3학년 신청 기간이 아닙니다.", applyStartDate, addOneFromStartDate);
  }
  else if((grade === 2 || grade === 1) && currentTime.isBefore(subtractOneFromEndDate)) {
    return msgMaker("1, 2학년 신청 기간이 아닙니다.", subtractOneFromEndDate, applyEndDate);
  }
  return false;
};