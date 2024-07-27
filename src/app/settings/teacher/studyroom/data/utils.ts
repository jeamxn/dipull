import { Studyroom } from "@/utils/db/utils";

export type StudyroomAllResponse = {
  success: boolean;
  data?: Studyroom[];
  error?: {
    title?: string;
    description?: string;
  }
}

export const StudyroomArrayToObject = (array: string[]) => { 
  const result: Studyroom["allow"] = {};
  for (const item of array) {
    const key = item[0];
    const value = parseInt(item.slice(1), 10);

    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(value);
  }
  return result;
};

export const StudyroomObjectToArray = (object: Studyroom["allow"]) => { 
  const result: string[] = [];
  for (const key in object) {
    for (const value of object[key]) {
      result.push(`${key}${value}`);
    }
  }
  return result;
};