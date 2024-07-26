import { Stay } from "@/utils/db/utils";

export type StayResponse = {
  success: boolean;
  myStay?: boolean;
  seat?: Stay["seat"];
  error?: {
    title?: string;
    description?: string;
  }
}