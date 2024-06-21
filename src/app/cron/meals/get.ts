import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";

import { getMealData } from "./server";

const GET = async (
  req: Request,
) => {
  // 헤더 설정
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");

  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse(JSON.stringify({
      success: false,
    }), {
      status: 401,
      headers: new_headers
    });
  }

  const meals = await getMealData();
  const client = await connectToDatabase();
  const mealsCollection = client.db().collection("meals");

  await Promise.all(meals.map(async (meal) => {
    await mealsCollection.updateOne({ date: meal.date }, { $set: meal }, { upsert: true });
  }));

  return new NextResponse(JSON.stringify({
    success: true,
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;