export type HomecomingData = {
  id: string;
  reason: string;
  week: string;
};

export type HomecomingDB = HomecomingData & {
  _id: string;
};