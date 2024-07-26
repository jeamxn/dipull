import "moment-timezone";
import moment from "moment";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import xss from "xss";

import { getWeekStart } from "@/utils/date";
import { collections } from "@/utils/db";
import { Outing, Stay } from "@/utils/db/utils";
import { accessVerify } from "@/utils/jwt";

import { Meals } from "../utils";

import { OutingResponse } from "./utils";

const PUT = async (
  req: NextRequest,
) => {
  try {
    const { outing, meals }: {
      outing: Outing["outing"];
      meals: Meals;
    } = await req.json();
    if (!outing) throw new Error("외출 정보를 입력해주세요.");
    if (!meals) throw new Error("급식 정보를 입력해주세요.");

    const accessToken = req.cookies.get("access_token")?.value || "";
    const { id } = await accessVerify(accessToken);
    const week = await getWeekStart();

    const outingDB = await collections.outing();
    const updateOuting = await outingDB.updateOne({
      week,
      id,
    }, {
      $set: {
        outing,
        meals,
      }
    }, {
      upsert: true,
    });
    if (updateOuting.matchedCount === 0 && updateOuting.upsertedCount === 0) { 
      throw new Error("외출 신청에 실패했습니다.");
    }
    
    const response = NextResponse.json<OutingResponse>({
      success: true,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<OutingResponse>({
      success: false,
      error: {
        title: "이럴수가...!",
        description: e.message,
      }
    }, {
      status: 400,
    });
    console.error(e.message);
    return response;
  }
};

export default PUT;