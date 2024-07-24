import { ErrorMessage } from "@/components/providers/utils";

export type WakeupListData = {
  _id: string;
  title: string;
  count: number;
};

export type WakeupListResponse = {
  success: boolean;
  data?: WakeupListData[];
  error?: ErrorMessage;
};