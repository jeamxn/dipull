import React from "react";

import { UserInfo } from "@/utils/db/utils";

import { machineTypeToKorean } from "../utils";

import { EditMachine } from "./utils";

const MachineSetting = ({
  machines, setMachines, machine
}: {
    machines: EditMachine[];
    setMachines: React.Dispatch<React.SetStateAction<EditMachine[]>>;
    machine: EditMachine;
  }) => { 
  return (
    <div className="w-full rounded-xl px-4 py-4 bg-white dark:bg-white-dark flex flex-col gap-4 dark:border border-text-dark/20">
      <div className="flex flex-col gap-2">
        <p className="text-base font-medium transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">{machineTypeToKorean(machine.type)}기 이름</p>
        <input
          type="text"
          className="w-full px-4 py-3 border border-text/20 dark:border-text-dark/30 rounded-xl outline-none text-text dark:text-text-dark bg-transparent"
          value={machine.name}
          onChange={(e) => {
            const newMachines = [...machines];
            newMachines[machines.indexOf(machine)].name = e.target.value;
            setMachines(newMachines);
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-base font-medium transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">허용 학년</p>
        <div className={[
          "flex flex-row items-center justify-between",
          // loadingOuting ? "opacity-50" : "",
        ].join(" ")}>
          {
            [1, 2, 3].map((grade) => {
              const isInGrade = machine.allow.includes(grade);
              return (
                <button
                  className={[
                    "flex flex-row items-center justify-start gap-1 w-full transition-opacity -my-2 py-2",
                    isInGrade ? "opacity-100" : "opacity-30",
                  ].join(" ")}
                  key={grade}
                  onClick={() => {
                    const newMachines = [...machines];
                    const index = newMachines.indexOf(machine);
                    if (isInGrade) {
                      newMachines[index].allow = newMachines[index].allow.filter((g) => g !== grade);
                    } else {
                      newMachines[index].allow.push(grade);
                    }
                    setMachines(newMachines);
                  }}
                  // disabled={disabled}
                >
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {
                      isInGrade ? (
                        <path className="fill-text dark:fill-text-dark" d="M5.4585 21.3165C4.9085 21.3165 4.43766 21.1207 4.046 20.729C3.65433 20.3374 3.4585 19.8665 3.4585 19.3165V5.31653C3.4585 4.76653 3.65433 4.2957 4.046 3.90403C4.43766 3.51236 4.9085 3.31653 5.4585 3.31653H17.9335C18.2168 3.31653 18.4543 3.41236 18.646 3.60403C18.8377 3.79569 18.9335 4.03319 18.9335 4.31653C18.9335 4.59986 18.8377 4.83736 18.646 5.02903C18.4543 5.22069 18.2168 5.31653 17.9335 5.31653H5.4585V19.3165H19.4585V12.8165C19.4585 12.5332 19.5543 12.2957 19.746 12.104C19.9377 11.9124 20.1752 11.8165 20.4585 11.8165C20.7418 11.8165 20.9793 11.9124 21.171 12.104C21.3627 12.2957 21.4585 12.5332 21.4585 12.8165V19.3165C21.4585 19.8665 21.2627 20.3374 20.871 20.729C20.4793 21.1207 20.0085 21.3165 19.4585 21.3165H5.4585ZM11.9835 14.5165L20.4835 6.01653C20.6668 5.8332 20.8918 5.74153 21.1585 5.74153C21.4252 5.74153 21.6585 5.8332 21.8585 6.01653C22.0585 6.19986 22.1585 6.4332 22.1585 6.71653C22.1585 6.99986 22.0585 7.24153 21.8585 7.44153L12.6835 16.6165C12.4835 16.8165 12.2502 16.9165 11.9835 16.9165C11.7168 16.9165 11.4835 16.8165 11.2835 16.6165L7.0335 12.3665C6.85016 12.1832 6.7585 11.9499 6.7585 11.6665C6.7585 11.3832 6.85016 11.1499 7.0335 10.9665C7.21683 10.7832 7.45016 10.6915 7.7335 10.6915C8.01683 10.6915 8.25016 10.7832 8.4335 10.9665L11.9835 14.5165Z" />
                      ) : (
                        <path className="fill-text dark:fill-text-dark" d="M5.4585 21.3165C4.9085 21.3165 4.43766 21.1207 4.046 20.729C3.65433 20.3374 3.4585 19.8665 3.4585 19.3165V5.31653C3.4585 4.76653 3.65433 4.2957 4.046 3.90403C4.43766 3.51236 4.9085 3.31653 5.4585 3.31653H19.4585C20.0085 3.31653 20.4793 3.51236 20.871 3.90403C21.2627 4.2957 21.4585 4.76653 21.4585 5.31653V19.3165C21.4585 19.8665 21.2627 20.3374 20.871 20.729C20.4793 21.1207 20.0085 21.3165 19.4585 21.3165H5.4585ZM5.4585 19.3165H19.4585V5.31653H5.4585V19.3165Z" />
                      )
                    }
                  </svg>
                  <p className="text-lg font-medium transition-all whitespace-nowrap text-text dark:text-text-dark">
                    {grade}학년
                  </p>
                </button>
              );
            })
          }
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-base font-medium transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">허용 성별</p>
        <div className="p-1.5 rounded-xl w-full flex flex-row gap-2 relative border border-text/20 dark:border-text-dark/30">
          <div className={[
            "absolute left-0 top-0 bottom-0 flex flex-row items-center justify-center w-full rounded-xl pointer-events-none p-1.5 transition-all duration-100",
            machine.gender === "male" ? "-translate-x-1/4 ml-[0.0625rem]" : "translate-x-1/4 -ml-[0.0625rem]",
          ].join(" ")}>
            <div className="bg-text dark:bg-text-dark w-[calc(50%-0.25rem)] h-full rounded-lg" />
          </div>
          {
            (["male", "female"] as UserInfo["gender"][]).map((gender) => (
              <button
                key={gender}
                className={[
                  "w-full rounded-lg px-6 py-2 bg-transparent z-50",
                ].join(" ")}
                onClick={() => {
                  const newMachines = [...machines];
                  const index = newMachines.indexOf(machine);
                  newMachines[index].gender = gender;
                  setMachines(newMachines);
                }}
              >
                <p className={[
                  "text-lg font-medium duration-100",
                  machine.gender === gender ? "text-white dark:text-white-dark" : "text-text/30 dark:text-text-dark/40",
                ].join(" ")}>
                  {gender === "male" ? "남" : "여"}
                </p>
              </button>
            ))
          }
        </div>
      </div>
      <div className="w-full flex flex-row items-center justify-center py-2">
        <button
          className="flex flex-row items-center justify-center gap-1 opacity-50 -my-2 py-2 -mx-5 px-5"
          onClick={() => {
            const newMachines = [...machines];
            newMachines.splice(machines.indexOf(machine), 1);
            setMachines(newMachines);
          }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-text dark:fill-text-dark" d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17ZM14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17Z"/>
          </svg>
          <p className="text-text dark:text-text-dark">삭제하기</p>
        </button>
      </div>
    </div>
  );
};

export default MachineSetting;