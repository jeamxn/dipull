import React from "react";

import { WakeupSelected } from "@/app/api/wakeup/utils";

export const menu = [
  {
    url: "/wakeup/list",
    name: "신청순위",
  },
  {
    url: "/wakeup/search",
    name: "검색하기",
  },
  {
    url: "/wakeup/my",
    name: "내 신청",
  },
];

export const calcDateDiff = (selected: WakeupSelected) => {
  const today = new Date();
  const day_selected = new Date(`${selected.date.substring(4,6)}/${selected.date.substring(6,8)}/${selected.date.substring(0,4)}`);
  const diff = (Math.abs(today.getTime() - day_selected.getTime()) / (1000 * 60 * 60 * 24)).toFixed();

  switch (diff) {
  case "0": return "오늘";
  case "1": return "어제";
  case "2": return "그저께";
  default:  return `${diff}일 전`;
  }
};