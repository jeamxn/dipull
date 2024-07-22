
export type MachineType = "washer" | "dryer";

export const machineTypeToKorean = (type: MachineType): string => { 
  if (type === "washer") return "세탁";
  if (type === "dryer") return "건조";
  return "";
};