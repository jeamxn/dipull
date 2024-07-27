import { ErrorMessage } from "@/components/providers/utils";
import { Outing, Stay, UserInfo } from "@/utils/db/utils";

export type KeyStay = {
  id: UserInfo["id"];
  name: UserInfo["name"];
  number: UserInfo["number"];
  gender: UserInfo["gender"];
  seat: Stay["seat"]["num"] | Stay["seat"]["reason"];
  week: Stay["week"];
  saturday: {
    meal: Outing["meals"]["saturday"];
    outing: Outing["outing"]["saturday"];
  };
  sunday: {
    meal: Outing["meals"]["sunday"];
    outing: Outing["outing"]["sunday"];
  }
};

export type KeyStayResponse = {
  success: boolean;
  data?: {
    [key: string]: {
      [key: string]: KeyStay[];
    }
  };
  error?: ErrorMessage;
  query?: {
    week: string;
  };
};