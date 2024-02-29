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
  };
  query: {
      week: string;
  };
};

export type StudyroomData = {
  color: string;
  grade: number[];
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
  return moment().tz("Asia/Seoul").startOf("week").add(1, "day").format("YYYY-MM-DD");
};

export const getApplyEndDate = async () => {
  const states = await getStates("stay");
  if(states?.end) {
    return moment(states.end).add(1, "day").format("YYYY-MM-DD");
  }
  return moment(await getApplyStartDate()).add(2, "day").format("YYYY-MM-DD");
};