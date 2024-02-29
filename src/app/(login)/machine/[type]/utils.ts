import { Machine as MachineType } from "@/app/api/machine/[type]/utils";

export const machineName = (name: string) => {
  const string = [];
  if(name[0] === "W") string.push("우정학사");
  else string.push("학봉관");
  
  string.push(`${name[1]}층`);

  if(name[2] === "L") string.push("왼쪽");
  else if(name[2] === "R") string.push("오른쪽");
  else if(name[2] === "C") string.push("중앙");
  return string.join(" ");
};

export const machineToKorean = (name: string, machine: MachineType) => {
  const string = [];
  const allowGrades = machine.allow.grades.join(", ");
  string.push(`[${allowGrades}학년]`);
  string.push(machineName(name));
  return string.join(" ");
};