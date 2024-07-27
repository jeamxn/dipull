import { Outing } from "@/utils/db/utils";

import { Meals } from "../../utils";

export type OutingResponse = {
  success: boolean;
  outing?: Outing["outing"];
  meals?: Meals;
  error?: {
    title?: string;
    description?: string;
  }
}

export const initailOutingResponse: Outing["outing"] = {
  saturday: [],
  sunday: [],
};