"use client";

import React from "react";

import Linker from "@/components/Linker";
import * as Select from "@/components/Select";
import { useSelectModalDispatch } from "@/components/SelectModal";

import { MachineType, machineTypeToKorean } from "./utils";

const Machine = ({ params }: { params: { type: MachineType } }) => {
  const current_korean = machineTypeToKorean(params.type);
  const [machine, setMachine] = React.useState<string>();
  const [time, setTime] = React.useState<string>();

  const machines = [
    {
      code: "H2C",
      name: "학봉관 2층 중앙",
      grade: [3],
    },
    {
      code: "H2L",
      name: "학봉관 2층 왼쪽",
      grade: [3],
    },
  ];
  const times = [
    "오후 6시 35분",
    "오후 7시 35분",
    "오후 8시 30분",
    "오후 9시 30분",
    "오후 10시 30분",
  ];

  return (
    <div className="py-6 flex flex-col gap-8">
      <div className="flex flex-row items-center justify-center gap-1 px-6">
        <Linker
          href="/machine/washer"
          className={[
            "text-xl font-semibold select-none cursor-pointer transition-all",
            params.type === "washer" ? "text-text dark:text-text-dark" : "text-text/30 dark:text-text-dark/60",
          ].join(" ")}>세탁기</Linker>
        <p className="text-xl font-semibold select-none text-text/30 dark:text-text-dark/60">·</p>
        <Linker
          href="/machine/dryer"
          className={[
            "text-xl font-semibold select-none cursor-pointer transition-all",
            params.type === "dryer" ? "text-text dark:text-text-dark" : "text-text/30 dark:text-text-dark/60",
          ].join(" ")}>건조기</Linker>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold px-6 text-text dark:text-text-dark">{current_korean}기 신청하기</p>
        <Select.Full
          label={`${current_korean}기 선택`}
          placeholder={`${current_korean}기를 선택해주세요.`}
          options={machines.map((machine) => machine.name)}
          value={machine}
          onConfirm={(value) => setMachine(value)}
        />
        <Select.Full
          label={`${current_korean} 시간 선택`}
          placeholder={`${current_korean} 시간을 선택해주세요.`}
          options={times}
          value={time}
          onConfirm={(value) => setTime(value)}
          disables={[true, false]}
        />
        <div className="px-6 w-full">
          <button
            className={[
              "p-3 bg-text dark:bg-text-dark text-white dark:text-white-dark rounded-xl font-semibold w-full transition-all",
              machine && time ? "cursor-pointer" : "cursor-not-allowed opacity-50",
            ].join(" ")}
            disabled={!machine || !time}
          >신청하기</button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold px-6 text-text dark:text-text-dark">{current_korean} 신청 현황</p>
        <div className="px-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory">
          <div className="flex flex-row w-max gap-1.5">
            {
              machines.map((machine, index) => (
                <div
                  className={[
                    "snap-center rounded-2xl p-6 bg-white dark:bg-text-dark/15 flex flex-col items-start justify-end gap-2 w-[calc(29rem)] max-md:w-[max(calc(100vw-3rem),250px)] h-max",
                  ].join(" ")}
                  key={index}
                >
                  <div className="flex flex-col gap-0.5">
                    {
                      times.map((time, i) => (
                        <div key={i} className="flex flex-row gap-1 opacity-30">
                          <p className="font-semibold text-text dark:text-text-dark">{time}</p>
                          <p className="text-text dark:text-text-dark">3629 최재민</p>
                        </div>
                      ))
                    }
                  </div>
                  <p className="text-2xl font-bold text-text dark:text-text-dark">[{machine.grade.join(", ")}학년] {machine.name}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Machine;