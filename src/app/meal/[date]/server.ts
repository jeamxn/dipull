"use server";

import axios from "axios";

import { Meal } from "./utils";

export const getMeal = async (date: string) => { 
  try { 
    const { data } = await axios({
      method: "GET",
      url: `https://api.디미고급식.com/meal/${date}`,
    });
    return {
      breakfast: data?.breakfast || "",
      lunch: data?.lunch || "",
      dinner: data?.dinner || "",
    } as Meal;
  }
  catch {
    return {
      breakfast: "",
      lunch: "",
      dinner: "",
    } as Meal;
  }
};