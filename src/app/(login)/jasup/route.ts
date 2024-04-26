import { NextResponse } from "next/server";

export const menu = [
  {
    url: "/jasup/my",
    name: "메인",
  },
  {
    url: "/jasup/book",
    name: "예약",
  },
  {
    url: "/jasup/statistics",
    name: "통계",
  },
];

export const GET = async (req: Request) => {
  return NextResponse.redirect(new URL(menu[0].url, process.env.NEXT_PUBLIC_APP_URI || ""));
};