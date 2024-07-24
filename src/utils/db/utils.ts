import { MachineType } from "@/app/machine/[type]/utils";

export type Timetable = {
  grd: number;
  cls: number;
  weekday: number;
  period: number;
  teacher: string;
  subject: string;
  classroom: string;
  changed: boolean;
  code: string;
};

export type UserInfo = {
  id: string;
  email: string;
  gender: "male" | "female";
  name: string;
  number: number;
  type: "student" | "teacher";
  profile_image: string;
};

export const defaultUser = {
  id: "",
  email: "",
  gender: "male",
  name: "미리보기",
  number: 1101,
  type: "student",
  profile_image: "https://lh3.googleusercontent.com/a/ACg8ocKyDiVdNK5iuPoyj3TGnsK7daSEj3ciCDPT99KKr_qq10tUvmoC=s96-c",
};

export type Refresh_tokenDB = {
  id: string;
  refresh_token: string;
  expires_in: string;
};

export type Machine_list = {
  type: MachineType;
  code: string;
  name: string;
  gender: UserInfo["gender"];
  allow: {
    default: number[];
    weekend: number[];
  }
}

export type Machine = {
  code: string;
  type: MachineType;
  owner: UserInfo["id"];
  date: string;
  time: string;
}
export type MachineJoin = {
  code: Machine["code"];
  type: Machine["type"];
  date: Machine["date"];
  time: Machine["time"];
  owner: {
    id: UserInfo["id"];
    gender: UserInfo["gender"];
    name: UserInfo["name"];
    number: UserInfo["number"];
  };
}

export type Wakeup = {
  owner: UserInfo["id"];
  week: string;
  date: string;
  video: string;
  title: string;
}

export type LastRequest = {
  user: UserInfo["id"];
  time: string;
}