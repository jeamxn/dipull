export type MealData = {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

export type Outing = {
  start: string;
  end: string;
  description: string;
}

export type OutingAndMealData = {
  meal: MealData;
  outing: Outing[];
}

export type OutingData = {
  owner: string;
  week: string;
  sat: OutingAndMealData;
  sun: OutingAndMealData;
};

export type OutingDB = OutingData & {
  _id: string;
}

export type OutingGetResponse = {
  success: boolean;
  data: {
      sat: OutingAndMealData;
      sun: OutingAndMealData;
  };
};

export const defaultOutingData: OutingAndMealData = {
  meal: {
    breakfast: true,
    lunch: true,
    dinner: true,
  },
  outing: []
};