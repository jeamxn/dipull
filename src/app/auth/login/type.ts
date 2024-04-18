import { ObjectId } from "mongodb";

export type ClientGet = "id" | "email" | "gender" | "name" | "number" | "type" | "profile_image";

export type ClientType = {
  [key in ClientGet]: string;
}

export const ClientGetType: ClientType = {
  id: "식별번호",
  email: "이메일",
  gender: "성별",
  name: "이름",
  number: "학번",
  type: "사용자 종류",
  profile_image: "프로필 이미지",
};
export const ClientGetTypeArray = Object.keys(ClientGetType) as ClientGet[];

export type ClientData = {
  owner: string;
  name: string;
  redirect: string[];
  get: ClientGet[];
}
export const defaultClientData: ClientData = {
  owner: "",
  name: "",
  redirect: [],
  get: [],
};

export type ClientDataDB = ClientData & {
  _id: ObjectId;
}

export type ClientDataDBString = ClientData & {
  _id: string;
}
export const defaultClientDataDBString: ClientDataDBString = {
  _id: "",
  ...defaultClientData,
};