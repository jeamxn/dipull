import { atom } from "recoil";

export const loadingAtom = atom({
  key: "loading",
  default: false,
});

export const login_url = `${process.env.NEXT_PUBLIC_DIMIGOIN_URI}/oauth?client=${process.env.NEXT_PUBLIC_DIMIGOIN_KEY}&redirect=${window.location.origin}/auth`;
