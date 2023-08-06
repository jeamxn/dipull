import { atom } from "recoil";


export const myInfoAtom = atom({
  key: "isLoginState",
  default: false,
});

export type IsLoading = boolean;
export const isLoadingAtom = atom<IsLoading>({
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