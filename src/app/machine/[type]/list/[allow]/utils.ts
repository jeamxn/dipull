import { UserInfo } from "@/utils/db/utils";

import { MachineType } from "../../utils";

export type Machine_list_Response = {
  type: MachineType;
  code: string;
  name: string;
  gender: UserInfo["gender"];
  allow: number[];
}
