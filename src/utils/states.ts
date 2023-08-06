import { atom } from "recoil";

import { UserInfoReturn } from "@/pages/api/userInfo";

export type MyInfoAtom = false | UserInfoReturn;
export const myInfoAtom = atom<MyInfoAtom>({
  key: "isLoginState",
  default: false,
});

export type IsLoadingAtom = boolean;
export const isLoadingAtom = atom<IsLoadingAtom>({
  key: "isLoadingState",
  default: false,
});


export const userInfoAtom = atom({  
  key: "userInfoState",
  default: {},
});


export const isAdminAtom = atom({
  key: "isAdminState",
  default: false,
});