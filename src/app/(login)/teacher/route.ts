import { NextResponse } from "next/server";

import { menu } from "./utils";

export const GET = async (req: Request) => {
  return NextResponse.redirect(new URL(menu[0].url, req.headers.get("x-origin") || ""));
};