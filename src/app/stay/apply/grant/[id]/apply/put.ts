import { NextRequest, NextResponse } from "next/server";
import xss from "xss";

import { getWeekStart, isApplyAvail, stayApplyErrorMessage } from "@/utils/date";
import { collections } from "@/utils/db";
import { Stay, UserInfo } from "@/utils/db/utils";
import { getUserByID } from "@/utils/server";

import { StayResponse } from "./utils";

const PUT = async (
  req: NextRequest,
  { params }: {
    params: {
      id: UserInfo["id"];
    }
  }
) => {
  try {
    const { reason, seat } = await req.json();
    if (!seat && !reason) { 
      throw new Error("좌석을 선택하거나 미선택 사유를 작성해주세요.");
    }
    else if (seat && reason) {
      throw new Error("좌석 선택 또는 미선택 사유만 입력해주세요.");
    }

    const { target, isTeacher } = await getUserByID(req, params.id);
    const { id, number, gender } = target;

    const applyStart = await isApplyAvail(number);
    if (!applyStart && !isTeacher) {
      throw new Error(await stayApplyErrorMessage(number));
    }

    const week = await getWeekStart();

    const seatData: Stay["seat"] = seat ? {
      onSeat: true,
      num: seat,
    } : {
      onSeat: false,
      reason: xss(reason),
    };

    const stay = await collections.stay();
    const myStay = await stay.countDocuments({
      id: id,
      week: week,
    });
    if (myStay >= 1) {
      throw new Error("이미 잔류 신청을 하셨습니다.");
    }

    if (seat) {
      const studyroom = await collections.studyroom();
      const myStudyroom = await studyroom.find({ 
        grade: Math.floor(number / 1000),
        gender,
      }).toArray();

      const combinedAllow: { [key: string]: Set<number> } = {};
    
      myStudyroom.forEach(doc => {
        for (const key in doc.allow) {
          if (!combinedAllow[key]) {
            combinedAllow[key] = new Set<number>();
          }
          doc.allow[key].forEach(value => {
            combinedAllow[key].add(value);
          });
        }
      });
      const result: { [key: string]: number[] } = {};
      for (const key in combinedAllow) {
        result[key] = Array.from(combinedAllow[key]);
      }
      if (!myStudyroom.length) {
        throw new Error("해당 학년이 이용 가능한 열람실 구역이 없습니다.");
      }
      let isAllow = false;
      const onlyAlpabet = seat.match(/[a-zA-Z]/g).join("");
      const onlyNumber = Number(seat.match(/[0-9]/g).join(""));
      for (const studyroom of myStudyroom) {
        if (studyroom.allow[onlyAlpabet].includes(onlyNumber)) {
          isAllow = true;
          break;
        }
      }
      if(!isAllow) {
        throw new Error("해당 좌석은 허용되지 않습니다.");
      }
    }

    const put = await stay.insertOne({
      week: week,
      id: id,
      seat: seatData,
    });
    if (!put.insertedId) {
      throw new Error("잔류 신청을 하는 중 오류가 발생했습니다.");
    }
    
    const response = NextResponse.json<StayResponse>({
      success: true,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<StayResponse>({
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