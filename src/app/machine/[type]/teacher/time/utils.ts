import { ErrorMessage } from "@/components/providers/utils";
import { Machine_Time } from "@/utils/db/utils";

export type TimesResponse = {
  data?: Times;
  error?: ErrorMessage;
}

export type Times = {
  [key in Machine_Time["when"]]: Machine_Time["time"];
};