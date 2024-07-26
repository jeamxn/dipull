import "moment-timezone";
import moment from "moment";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import xss from "xss";

import { getWeekStart } from "@/utils/date";
import { collections } from "@/utils/db";
import { accessVerify } from "@/utils/jwt";

import { StayResponse } from "./utils";

const GET = async (
  req: NextRequest,
) => {
  try {
    const accessToken = req.cookies.get("access_token")?.value || "";
    const { id } = await accessVerify(accessToken);
    const week = await getWeekStart();

    const stay = await collections.stay();
    const myStay = await stay.findOne({
      id: id,
      week: week,
    });

    const response = NextResponse.json<StayResponse>({
      success: true,
      myStay: myStay ? true : false,
      seat: myStay?.seat,
    });

    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<StayResponse>({
      success: false,
      error: {
        title: "이런!!",
        description: e.message,
      }
    }, {
      status: 400,
    });
    console.error(e.message);
    return response;
  }
};

export default GET;