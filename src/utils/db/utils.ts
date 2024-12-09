import { MachineType } from "@/app/machine/[type]/utils";
import { Times } from "@/app/stay/homecoming/utils";
import { Meals, OutingType } from "@/app/stay/outing/utils";

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

export const defaultUser: UserInfo = {
  id: "",
  email: "",
  gender: "male",
  name: "미리보기",
  number: 1101,
  type: "student",
  profile_image: "https://lh3.googleusercontent.com/a/ACg8ocKyDiVdNK5iuPoyj3TGnsK7daSEj3ciCDPT99KKr_qq10tUvmoC=s96-c",
};

export type Refresh_tokenDB = {
  id: UserInfo["id"];
  refresh_token: string;
  expires_in: string;
};

export type Machine_list = {
  type: MachineType;
  // code: string;
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

export type Bamboo = {
  user: UserInfo["id"];
  title: string;
  content: string;
  grade: boolean;
  anonymous: boolean;
  good: string[];
  bad: string[];
  timestamp: string;
};

export type BambooComment = {
  document: string;
  user: UserInfo["id"];
  text: string;
  grade: boolean;
  anonymous: boolean;
  good: string[];
  bad: string[];
  timestamp: string;
};

export type Homecoming = {
  week: string;
  id: UserInfo["id"];
  reason: string;
  time: Times;
};

export type Stay = {
  week: string;
  id: UserInfo["id"];
  seat: {
    onSeat: boolean;
    num?: string;
    reason?: string;
  };
};

export type Studyroom = {
  grade: number[];
  gender: UserInfo["gender"];
  allow: {
    [key: string]: number[];
  }
};

export type Outing = {
  week: string;
  id: UserInfo["id"];
  outing: OutingType;
  meals: Meals;
};

export type Machine_Time = {
  type: MachineType;
  when: "weekend" | "default";
  time: string[];
};

export type Meal = {
  info: {
    year: number;
    month: number;
    date: number;
    url: string;
  };
  data: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
  };
}