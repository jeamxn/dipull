
export type MachineType = "washer" | "dryer";

export const machineTypeToKorean = (type: MachineType): string => { 
  if (type === "washer") return "세탁";
  if (type === "dryer") return "건조";
  return "";
};

export const machine_menus = [
  {
    name: "세탁기",
    url: "/machine/washer",
  },
  {
    name: "건조기",
    url: "/machine/dryer",
  },
];

export const machine_teacher_menus = [
  {
    name: "세탁 설정",
    url: "/machine/washer/teacher",
  },
  {
    name: "건조 설정",
    url: "/machine/dryer/teacher",
  },
];