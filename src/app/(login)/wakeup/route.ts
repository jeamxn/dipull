import { NextResponse } from "next/server";

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

export const GET = async (req: Request) => {
  return NextResponse.redirect(new URL(menu[0].url, process.env.NEXT_PUBLIC_APP_URI || ""));
};