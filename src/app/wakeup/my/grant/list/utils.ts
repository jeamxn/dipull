import { WithId } from "mongodb";

import { ErrorMessage } from "@/components/providers/utils";
import { Wakeup } from "@/utils/db/utils";

export type MyWakeupResponse = {
  success: boolean;
  data?: WithId<Wakeup>[];
  error?: ErrorMessage;
}

export type MyWakeupResponseString = {
  success: MyWakeupResponse["success"];
  data?: (Wakeup & {
    _id: string;
  })[];
  error?: MyWakeupResponse["error"];
}