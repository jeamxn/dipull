import { Studyroom } from "@/utils/db/utils";

export type ToEditResponse = {
  success: boolean;
  error?: {
    title?: string;
    description?: string;
  }
}