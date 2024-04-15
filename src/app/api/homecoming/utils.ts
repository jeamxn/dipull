import { ValueOf } from "next/dist/shared/lib/constants";

import { UserDB } from "@/app/auth/type";

export type HomecomingData = {
  id: UserDB["id"];
  reason: string;
  week: string;
  time: ValueOf<typeof goTime>;
};

export type HomecomingDB = HomecomingData & {
  _id: string;
};

export const goTime = ["종례 후", "저녁시간", "야자1 이후", "야자2 이후"];
