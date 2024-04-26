import { NextResponse } from "next/server";

export const menu = [
  {
    url: "/teacher/edit",
    name: "기숙사 수정",
  },
  {
    url: "/teacher/jasup",
    name: "자습 도우미",
  },
  {
    url: "/teacher/download",
    name: "다운로드",
  },
  {
    url: "/teacher/wakeup",
    name: "기상송",
  },
];

export const GET = async (req: Request) => {
  return NextResponse.redirect(new URL(menu[0].url, process.env.NEXT_PUBLIC_APP_URI || ""));
};