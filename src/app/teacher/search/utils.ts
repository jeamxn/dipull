import { ErrorMessage } from "@/components/providers/utils";
import { UserInfo } from "@/utils/db/utils";

export type UserSearchResponse = {
  success: boolean;
  data?: UserInfo[]; 
  error?: ErrorMessage;
}