"use server";

import axios from "axios";
import * as cheerio from "cheerio";

import { Meal } from "@/utils/db/utils";

const parseMeal = (meals: string[], type: "조식" | "중식" | "석식") => 
  meals.find((meal) => meal.includes(type))?.replaceAll(`*${type}: `, "").split("/").filter(e => !!e) || [];

export const getMealDatas = async () => {
  const { data } = await axios.get("https://www.dimigo.hs.kr/index.php?mid=school_cafeteria");
  const $ = cheerio.load(data);
  const cols = $("tr");

  const mealDatas: Meal[] = [];
  
  for(const col of cols) {
    const $$ = cheerio.load(col)(".title > div > a");
    const title = $$.text().trim().replaceAll(" ", "");
    const url = $$.attr("href");
    if(!title || !url) continue;

    const { data: mealData } = await axios.get(url);
    const $$$ = cheerio.load(mealData);
    const meals = $$$("#siDoc > ul:nth-child(5) > li > div > div > p");
    const mealTexts = meals.map((_, meal) => $$$(meal).text().trim()).get().filter((meal) => meal.includes("조식") || meal.includes("중식") || meal.includes("석식"));

    const mealJson: Meal["data"] = {
      breakfast: parseMeal(mealTexts, "조식"),
      lunch: parseMeal(mealTexts, "중식"),
      dinner: parseMeal(mealTexts, "석식"),
    };

    const month = Number(title.split("월")[0]);
    const date = Number(title.split("월")[1].split("일")[0]);
    const json: Meal = {
      info: {
        year: new Date().getFullYear(),
        month,
        date,
        url,
      },
      data: mealJson
    };
    mealDatas.push(json);
  }
  return mealDatas;
};
