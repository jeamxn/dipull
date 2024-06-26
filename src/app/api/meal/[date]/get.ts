import axios from "axios";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { verify } from "@/utils/jwt";

import { getMeal } from "./server";

type Params = {
  date: string; // YYYY-MM-DD
};

export type Meal = {
  breakfast: string;
  lunch: string;
  dinner: string;
};

export type MealResponse = {
  success: boolean;
  message: string;
  data: Meal;
};

const GET = async (
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

  try{
    const response: MealResponse = {
      success: true,
      message: "성공적으로 급식 데이터를 가져왔습니다.",
      data: await getMeal(params.date),
    };
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: new_headers
    });
  }
  catch {
    const response: MealResponse = {
      success: false,
      message: "급식 데이터가 없습니다.",
      data: {
        breakfast: "",
        lunch: "",
        dinner: ""
      }
    };
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: new_headers
    });
  }
};

export default GET;