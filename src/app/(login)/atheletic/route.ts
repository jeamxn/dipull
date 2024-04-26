import { NextResponse } from "next/server";

export const menu = [
  {
    url: "/atheletic/score",
    name: "점수",
  },
  {
    url: "/atheletic/schedule",
    name: "일정",
  },
  {
    url: "/atheletic/gallery",
    name: "갤러리",
  },
  {
    url: "/atheletic/pikachu",
    name: "피캬츄",
  },
];

export const GET = async (req: Request) => {
  return NextResponse.redirect(new URL(menu[0].url, process.env.NEXT_PUBLIC_APP_URI || ""));
};