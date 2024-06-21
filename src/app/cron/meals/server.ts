"use server";

import axios from "axios";
import _ from "lodash";
import moment from "moment";
import { parse } from "node-html-parser";

type MealType = "breakfast" | "lunch" | "dinner";
type Meal = [MealType, string];
type Meals = {
  date: string;
} & {
  [key in MealType]: string;
};

export const getMealData = async () => {
  const url = "https://www.dimigo.hs.kr/index.php?mid=school_cafeteria";
  const { data } = await axios.get(url);
  const root = parse(data);

  const table = root.querySelector("#dimigo_post_cell_1")?.childNodes;
  if (!table) throw new Error("Table not found");

  const list = (await Promise.all(table.map(async (tr) => {
    try{
      const title = tr.childNodes[3];
      const add = moment(tr.childNodes[6].innerText, "YYYY-MM-DD").get("year");
      const text = title.innerText.replace(/\n/g, "").replace(/\t/g, "").replace(" 식단입니다.", "");
      const time = moment(`${add}년 ${text}`, "YYYY년 M월 D일");
      const href = title.toString().match(/href="([^"]+)"/)?.[1] || "";
      const date = time.format("YYYY-MM-DD");
      if (!href) throw new Error("URL not found");
      const mealRow = await axios.get(href);
      const mealRoot = parse(mealRow.data).querySelector("#siDoc > ul:nth-child(5) > li > div.scConDoc.clearBar > div");
      if (!mealRoot?.childNodes) throw new Error("Children not found");
      const children = mealRoot.childNodes.map((x) => 
        x.toString()
          .replace(/\n/g, "")
          .replace(/\t/g, "")
          .replace(/<p>/g, "")
          .replace(/<\/p>/g, "")
      ).filter((x) => {
        if (x.includes("<img")) return false;
        if (x.includes("조식") || x.includes("중식") || x.includes("석식")) return true;
        return false;
      }).map((x) => {
        const slice =  _.unescape(x.split(":")[1].replace(/ /g, ""));
        if (x.includes("조식")) return ["breakfast", slice];
        if (x.includes("중식")) return ["lunch", slice];
        if (x.includes("석식")) return ["dinner", slice];
      }) as unknown as Meal[];
      return [date, children];
    }
    catch{
      return null;
    }
  }))).filter((x) => x) as [string, Meal[]][];
  const meals: Meals[] = list.map(([date, meal]) => {
    const obj = { date, breakfast: "", lunch: "", dinner: "" };
    meal.forEach(([key, value]) => {
      obj[key] = value;
    }
    );
    return obj;
  });
  return meals;
};