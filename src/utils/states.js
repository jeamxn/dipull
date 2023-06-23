import { atom } from "recoil";

export const myInfoAtom = atom({
  key: "isLoginState",
  default: false,
});

export const isLoadingAtom = atom({
  key: "isLoadingState",
  default: false,
});