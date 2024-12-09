import { NextRequest, NextResponse } from "next/server";

import { Meal } from "@/utils/db/utils";

import { getMeal } from "./server";

type MealParams = {
  date: string; // YYYY-MM-DD
};

export type MealResponse = {
  success: boolean;
  message: string;
  data: Meal["data"];
};

const GET = async (
  req: NextRequest,
  { params }: { params: MealParams }
) => {
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");

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
        breakfast: [],
        lunch: [],
        dinner: []
      }
    };
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: new_headers
    });
  }
};

export default GET;