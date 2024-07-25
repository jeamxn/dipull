export type OutingInfo = {
  day: "saturday" | "sunday";
  start: string;
  end: string;
  reason: string;
};

export const initailOuting: OutingInfo = {
  day: "saturday",
  start: "",
  end: "",
  reason: "",
};

export type OutingType = {
  saturday: OutingInfo[];
  sunday: OutingInfo[];
};