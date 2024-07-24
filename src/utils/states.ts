import { atom } from "recoil";

export const loadingAtom = atom({
  key: "loading",
  default: false,
});
