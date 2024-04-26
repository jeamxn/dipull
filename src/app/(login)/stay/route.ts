import { NextResponse } from "next/server";

export const menu = [
  {
    url: "/stay/apply",
    name: "잔류",
  },
  {
    url: "/stay/outing",
    name: "외출",
  },
  {
    url: "/stay/homecoming",
    name: "금귀",
  }
];

export const GET = async (req: Request) => {
  return NextResponse.redirect(new URL(menu[0].url, process.env.NEXT_PUBLIC_APP_URI || ""));
};