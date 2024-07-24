import { ErrorMessage } from "@/components/providers/utils";

export type WakeupPutResponse = {
  success: boolean;
  error?: ErrorMessage;
}