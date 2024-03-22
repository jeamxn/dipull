import { StayDB } from "@/app/api/stay/utils";
import { UserDB } from "@/app/auth/type";

export type SheetGradeClassInner = {
  id: UserDB["id"],
  name: UserDB["name"],
  number: UserDB["number"],
  gender: UserDB["gender"],
  week: StayDB["week"],
  reason: string;
  time: string;
}

export type SheetByGradeClassObj = {
  [key: string]: {
    [key: string]: SheetGradeClassInner[];
  }
}

export type SheetResponse = {
  message: string;
  data: SheetByGradeClassObj;
  query: {
    week: string;
  };
}