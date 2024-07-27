import { Machine_list_Response } from "../list/[allow]/utils";

export type EditMachine = {
  code?: Machine_list_Response["code"];
  type: Machine_list_Response["type"];
  allow: Machine_list_Response["allow"];
  gender: Machine_list_Response["gender"];
  name: Machine_list_Response["name"];
};