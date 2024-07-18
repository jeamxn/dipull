import { atom } from "recoil";

export const darkModeAtom = atom({
  key: "darkMode",
  default: false,
});

export const loadingAtom = atom({
  key: "loading",
  default: false,
});

export const isFireworkFrameAtom = atom({
  key: "isFireworkFrame",
  default: false,
});

export type Notification = {
  type: "notification" | "alert";
  title?: string;
  text: string;
  date: string;
  onclick?: () => void;
};

export const notificationsAtom = atom<Notification[]>({
  key: "notifications",
  default: [],
});

export const isFooterAtom = atom({
  key: "isFooter",
  default: true,
});

export const isHeaderAtom = atom({
  key: "isHeader",
  default: true,
});