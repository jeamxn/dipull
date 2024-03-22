export type HomecomingData = {
  id: string;
  reason: string;
  week: string;
  time: string;
};

export type HomecomingDB = HomecomingData & {
  _id: string;
};

export const goTime = ["종례 후", "저녁시간", "야자1 이후", "야자2 이후"];
