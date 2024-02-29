import { OutingAndMealData } from "@/app/api/outing/utils";
import { GradeClassInner } from "@/app/api/stay/utils";

export type SheetGradeClassInner = GradeClassInner & {
  sat: OutingAndMealData;
  sun: OutingAndMealData;
}

export type SheetByGradeClassObj = {
  [key: string]: {
    [key: string]: SheetGradeClassInner[];
  }
}

export type SheetResponse = {
  message: string;
  data: SheetByGradeClassObj;
  query: {
    week: string;
  };
}