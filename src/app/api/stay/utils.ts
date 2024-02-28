import "moment-timezone";
import moment from "moment";

import { UserDB } from "@/app/auth/type";

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

export type ByGradeClassObj = {
  [key: string]: {
    [key: string]: {
      id: UserDB["id"],
      name: UserDB["name"],
      number: UserDB["number"],
      gender: UserDB["gender"],
      seat: StayDB["seat"],
      week: StayDB["week"],
    }[];
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

export const getApplyStartDate = () => {
  return moment().tz("Asia/Seoul").startOf("week").add(1, "day").format("YYYY-MM-DD");
};

export const getApplyEndDate = () => {
  // return moment(getApplyStartDate()).add(1, "day").format("YYYY-MM-DD");
  return "2024-02-30";
};