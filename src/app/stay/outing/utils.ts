export type OutingInfo = {
  day: "saturday" | "sunday";
  start: string;
  end: string;
  reason: string;
};

export const initailOuting: OutingInfo = {
  day: "saturday",
  start: "10:20",
  end: "14:00",
  reason: "",
};

export const sundayOuting: OutingInfo = {
  day: "sunday",
  start: "10:20",
  end: "14:00",
  reason: "자기계발외출",
};

export type Weekend = "saturday" | "sunday";
export const weekends: Readonly<Weekend[]> = ["saturday", "sunday"];
export const koreanWeekends: Readonly<Record<Weekend, string>> = {
  saturday: "토",
  sunday: "일",
};

export type OutingType = {
  [key in Weekend]: OutingInfo[];
};

export type Meal = "breakfast" | "lunch" | "dinner";
export const meals: Readonly<Meal[]> = ["breakfast", "lunch", "dinner"];
export const koreanMeals: Readonly<Record<Meal, string>> = {
  breakfast: "아침",
  lunch: "점심",
  dinner: "저녁",
};
export type Meals = Record<Weekend, Record<"breakfast" | "lunch" | "dinner", boolean>>;
export const initialMeals: Meals = {
  saturday: {
    breakfast: true,
    lunch: true,
    dinner: true,
  },
  sunday: {
    breakfast: true,
    lunch: true,
    dinner: true,
  },
};
