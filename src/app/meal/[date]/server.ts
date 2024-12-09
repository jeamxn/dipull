"use server";

import { collections } from "@/utils/db";
import { Meal } from "@/utils/db/utils";

export const getMeal = async (date: string) => { 
  try { 
    const mealCollection = await collections.meal();
    const dates = date.split("-").map(Number);
    const meal = await mealCollection.findOne({ "info.year": dates[0], "info.month": dates[1], "info.date": dates[2] });
    return meal?.data || {
      breakfast: [],
      lunch: [],
      dinner: [],
    } as Meal["data"];
  }
  catch {
    return {
      breakfast: [],
      lunch: [],
      dinner: [],
    } as Meal["data"];
  }
};