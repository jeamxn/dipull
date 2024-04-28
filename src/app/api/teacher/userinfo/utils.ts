import { UserDB } from "@/app/auth/type";

export type UserInfo = {
  id: string;
  gender: string;
  name: string;
  number: number;
  profile_image: string;
  type: UserDB["type"];
};

export type UserInfoResponse = {
  message: string;
  data: UserInfo[];
};

export type UserInfo1Response = {
  message: string;
  data: UserInfo;
};

export const defaultUserData: UserInfo = {
  id: "",
  gender: "male",
  name: "",
  number: 0,
  profile_image: "https://dimigo.net/profile.jpg",
  type: "student",
};