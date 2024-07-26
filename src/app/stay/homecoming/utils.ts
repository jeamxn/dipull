export type Times = "school" | "dinner" | "yaja1" | "yaja2";
export const times: Readonly<Times[]> = ["school", "dinner", "yaja1", "yaja2"];
export const koreanTimes: Readonly<Record<Times, string>> = {
  school: "종례 후",
  dinner: "저녁시간",
  yaja1: "야자1 뒤",
  yaja2: "야자2 뒤",
};
