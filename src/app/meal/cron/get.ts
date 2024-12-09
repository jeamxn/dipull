import { NextRequest, NextResponse } from "next/server";

import { collections } from "@/utils/db";

import { getMealDatas } from "./server";

type MealParams = {
  date: string;
};

const GET = async (
  req: NextRequest,
  { params }: { params: MealParams }
) => {
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
  
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV !== "development") {
    return new NextResponse(JSON.stringify({
      success: false,
      message: "Unauthorized",
    }), {
      status: 401,
      headers: new_headers
    });
  }

  const meal = await getMealDatas();
  const mealCollection = await collections.meal();
  await Promise.all(
    meal.map((meal) =>
      mealCollection.updateOne({ "info.month": meal.info.month, "info.date": meal.info.date }, { $set: meal }, { upsert: true })
    )
  );

  return new NextResponse(JSON.stringify({
    success: true,
    message: "Success",
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;