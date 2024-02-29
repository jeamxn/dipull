import "moment-timezone";
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

const dimi_subject: {
  [key: string]: string;
} = {
  "IoT 서비스 모형 기획": "사물",
  "IoT 응용소프트웨어 기획": "사물",
  "컴퓨터 그래픽": "컴그",
  "진로활동": "진로",
  "상업 경제": "상경",
  "통합사회": "사회",
  "한국사": "국사",
  "통합과학": "과학",
  "자율활동": "HR",
  "동아리활동": "CA",
  "컴퓨터 시스템 일반": "컴일",
  "프로그래밍": "플밍",
  "수학Ⅰ": "수Ⅰ",
  "수학Ⅱ": "수Ⅱ",
  "회계 원리": "회계",
  "영어Ⅰ": "영Ⅰ",
  "마케팅과 광고": "마광",
  "문학과 매체": "문학",
  "운동과 건강": "운동",
  "성공적인 직업생활": "성직",
  "공업수학의 기초": "공수",
  "화면 구현": "화구",
  "UI 디자인": "UI",
  "정보 통신": "정통",
  "시스템 보안 운영": "정보",
  "네트워크 보안 운영": "정보",
  "중국어Ⅰ": "중Ⅰ",
  "화학Ⅰ": "화Ⅰ",
  "물리Ⅰ": "물Ⅰ",
  "확률과 통계": "확통",
  "데이터베이스 구현": "DB",
  "수출마케팅": "수출",
  "데이터베이스 요구사항 분석": "요분",
  "비즈니스 영어": "비영",
  "고전 읽기": "고전",
  "문화 콘텐츠 산업 일반": "문콘",
  "수입마케팅": "수입",
  "전표관리": "전표",
  "빅데이터 수집": "빅수",
  "분석용 데이터 탐색": "데탐",
  "자금관리": "자금",
  "프로그램 기획": "프기",
  "프로그래밍 언어 활용": "프활",
  "공업수학": "공수",
  "공업 일반": "공일",
  "인공지능과 미래사회": "인미",
  "네트워크 프로그래밍 구현": "네프",
  "네트워크 프로토콜 분석": "네프",
  "인터넷  설비 설계": "인설",
  "네트워크유지보수": "네유",
  "정보보호 계획 수립": "정보",
  "미적분": "미적",
  "제작준비": "제준",
  "광고 전략 수립": "광콘",
  "그래픽 제작": "컴그",
  "음악콘텐츠제작기획": "음콘",
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
        TI_FROM_YMD: moment().tz("Asia/Seoul").startOf("isoWeek").format("YYYYMMDD"),
        TI_TO_YMD: moment().tz("Asia/Seoul").endOf("isoWeek").format("YYYYMMDD"),
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
        onePeriod[Day[day.DAY]] = dimi_subject[day.ITRT_CNTNT] || day.ITRT_CNTNT;
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