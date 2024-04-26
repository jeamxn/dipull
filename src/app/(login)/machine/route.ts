import { NextResponse } from "next/server";

export const menu = [
  {
    url: "/machine/washer",
    name: "세탁기",
  },
  {
    url: "/machine/dryer",
    name: "건조기",
  },
];

export const GET = async (req: Request) => {
  return NextResponse.redirect(new URL(menu[0].url, process.env.NEXT_PUBLIC_APP_URI || ""));
};