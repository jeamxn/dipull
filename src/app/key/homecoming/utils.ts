import { ErrorMessage } from "@/components/providers/utils";
import { Homecoming, Stay, UserInfo } from "@/utils/db/utils";

export type KeyHomecoming = {
  id: UserInfo["id"];
  name: UserInfo["name"];
  number: UserInfo["number"];
  gender: UserInfo["gender"];
  week: Stay["week"];
  reason: Homecoming["reason"];
  time: Homecoming["time"];
};

export type KeyHomecomingResponse = {
  success: boolean;
  data?: {
    [key: string]: {
      [key: string]: KeyHomecoming[];
    }
  };
  error?: ErrorMessage;
  query?: {
    week: string;
  };
};