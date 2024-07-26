import { Studyroom } from "@/utils/db/utils";

export type StudyroomResponse = {
  success: boolean;
  allow?: Studyroom["allow"];
  error?: {
    title?: string;
    description?: string;
  }
}