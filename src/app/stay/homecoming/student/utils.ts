import { Homecoming } from "@/utils/db/utils";

export type HomecomingResponse = {
  success: boolean;
  data?: Homecoming;
  error?: {
    title?: string;
    description?: string;
  }
}