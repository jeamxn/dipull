"use server";

import { getStates } from "@/utils/getStates";

export const getStayWhere = async () => { 
  return await getStates("class_stay");
};