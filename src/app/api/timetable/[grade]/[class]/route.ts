import axios from "axios";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { Day } from "@/utils/date";
import { verify } from "@/utils/jwt";

type Params = {
  grade: string;
  class: string;
};

export type TimetableResponse = {
  success: boolean;
  message: string;
  checksum: string;
  data: {
    [key: number]: {
      "월": string;
      "화": string;
      "수": string;
      "목": string;
      "금": string;
    }
  };
};

export const GET = async (
  req: Request,
  { params }: { params: Params }
) => {
  // 헤더 설정
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
  
  // Authorization 헤더 확인
  const authorization = headers().get("authorization");
  const verified = await verify(authorization?.split(" ")[1] || "");
  if(!verified.ok || !verified.payload?.id) return new NextResponse(JSON.stringify({
    message: "로그인이 필요합니다.",
  }), {
    status: 401,
    headers: new_headers
  });

  if(!params.grade || !params.class) return new NextResponse(JSON.stringify({
    message: "학년과 반을 입력해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  if(isNaN(Number(params.grade)) || isNaN(Number(params.class))) return new NextResponse(JSON.stringify({
    message: "학년과 반은 숫자로 입력해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });

  try{ 
    const { data } = await axios({
      method: "GET",
      url: "https://open.neis.go.kr/hub/hisTimetable",
      params: {
        KEY: process.env.NEIS_API_KEY,
        Type: "json",
        ATPT_OFCDC_SC_CODE: "J10",
        SD_SCHUL_CODE: "7530560",
        GRADE: params.grade || "1",
        CLASS_NM: params.class || "1",
        // TI_FROM_YMD: "20220314",
        // TI_TO_YMD: "20220314",
        // 이번주 월요일부터 금요일까지
        TI_FROM_YMD: moment("20231220").startOf("isoWeek").format("YYYYMMDD"),
        TI_TO_YMD: moment("20231220").endOf("isoWeek").format("YYYYMMDD"),
      }
    });
    const row = data.hisTimetable[1].row;
  
    const getPeriodSubject = (period: number) => {
      const onePeriod: any = {};
      const list = row.filter((v: any) => v.PERIO === String(period)).map((v: any) => ({
        DAY: moment(v.ALL_TI_YMD).day(),
        ITRT_CNTNT: v.ITRT_CNTNT.replaceAll("* ", ""),
      }));
      for(const day of list) {
        onePeriod[Day[day.DAY]] = day.ITRT_CNTNT;
      }
      return onePeriod;
    };
  
    const periods: TimetableResponse["data"] = {};
    for(let i = 1; i <= 7; i++) {
      periods[i] = getPeriodSubject(i);
    }
  
    const response: TimetableResponse = {
      success: true,
      checksum: `${params.grade}${params.class}`,
      message: "시간표를 성공적으로 불러왔습니다.",
      data: periods
    };
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: new_headers
    });
  }
  catch(e) {
    return new NextResponse(JSON.stringify({
      message: "시간표를 불러오는데 실패했습니다.",
    }), {
      status: 500,
      headers: new_headers
    });
  }
};