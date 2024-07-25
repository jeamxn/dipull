export type OutingInfo = {
  day: "saturday" | "sunday";
  start: string;
  end: string;
  reason: string;
};

export const initailOuting: OutingInfo = {
  day: "saturday",
  start: "10:20",
  end: "14:00",
  reason: "",
};

export type OutingType = {
  saturday: OutingInfo[];
  sunday: OutingInfo[];
};