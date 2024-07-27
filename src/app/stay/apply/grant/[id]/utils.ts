import { Studyroom } from "@/utils/db/utils";

export type StudyroomResponse = {
  success: boolean;
  allow?: Studyroom["allow"];
  stays?: {
    [key: string]: {
      [key: string]: string;
    };
  };
  error?: {
    title?: string;
    description?: string;
  }
}