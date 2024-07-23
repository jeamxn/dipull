"use client";

import React from "react";

import Linker from "@/components/Linker";
import SelectModal, { useSelectModalDispatch } from "@/components/SelectModal";

import { MachineType, machineTypeToKorean } from "./utils";

const Machine = ({ params }: { params: { type: MachineType } }) => {
  const selectModalDispatch = useSelectModalDispatch();

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
            params.type === "washer" ? "text-text" : "text-text/30 dark:text-text/60s",
          ].join(" ")}>세탁기</Linker>
        <p className="text-xl font-semibold select-none text-text/30 dark:text-text/60s">·</p>
        <Linker
          href="/machine/dryer"
          className={[
            "text-xl font-semibold select-none cursor-pointer transition-all",
            params.type === "dryer" ? "text-text" : "text-text/30 dark:text-text/60s",
          ].join(" ")}>건조기</Linker>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold px-6">{current_korean}기 신청하기</p>
        {/* <SelectModal
          label={`${current_korean}기 선택`}
          placeholder={`${current_korean}기를 선택해주세요.`}
          options={machines.map((machine) => machine.name)}
          value={machine}
          onConfirm={(value) => setMachine(value)}
        /> */}
        <div className="flex flex-col gap-2 px-6">
          <p className="font-medium text-base text-text/50">{current_korean}기 선택</p>
          <button
            className="cursor-pointer w-full rounded bg-text/10 hover:bg-text/20 dark:bg-text/15 dark:hover:bg-text/20 flex flex-row items-center justify-between px-4 py-3"
            onClick={() => {
              selectModalDispatch({
                type: "show",
                data: {
                  label: `${current_korean}기 선택`,
                  options: machines.map((machine) => machine.name),
                  value: machine,
                  onConfirm: (value) => setMachine(value),
                },
              });
            }}
          >
            <p className="font-medium select-none">{machine || `${current_korean}기를 선택해주세요.`}</p>
            <div
              className={[
                "transition-transform",
                // showDetails ? "rotate-180" : "",
              ].join(" ")}
            >
              <svg className="w-6 h-6 fill-text" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="fill-inherit" d="M11.3 14.7375L8.69998 12.1375C8.38331 11.8208 8.31248 11.4583 8.48748 11.05C8.66248 10.6417 8.97498 10.4375 9.42498 10.4375H14.575C15.025 10.4375 15.3375 10.6417 15.5125 11.05C15.6875 11.4583 15.6166 11.8208 15.3 12.1375L12.7 14.7375C12.6 14.8375 12.4916 14.9125 12.375 14.9625C12.2583 15.0125 12.1333 15.0375 12 15.0375C11.8666 15.0375 11.7416 15.0125 11.625 14.9625C11.5083 14.9125 11.4 14.8375 11.3 14.7375Z" />
              </svg>
            </div>
          </button>
        </div>

        {/* <SelectModal
          label={`${current_korean} 시간 선택`}
          placeholder={`${current_korean} 시간을 선택해주세요.`}
          options={times}
          value={time}
          onConfirm={(value) => setTime(value)}
          disables={[true, false]}
        /> */}
        <div className="px-6 w-full">
          <button
            className={[
              "p-3 bg-text text-white rounded-md font-semibold w-full transition-all",
              machine && time ? "cursor-pointer" : "cursor-not-allowed opacity-50",
            ].join(" ")}
            disabled={!machine || !time}
          >신청하기</button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold px-6">{current_korean} 신청 현황</p>
        <div className="px-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory">
          <div className="flex flex-row w-max gap-1.5">
            {
              machines.map((machine, index) => (
                <div
                  className={[
                    "snap-center rounded-2xl p-6 bg-white dark:bg-text/15 flex flex-col items-start justify-end gap-2 w-[calc(29rem)] max-md:w-[max(calc(100vw-3rem),250px)] h-max",
                  ].join(" ")}
                  key={index}
                >
                  <div className="flex flex-col gap-0.5">
                    {
                      times.map((time, i) => (
                        <div key={i} className="flex flex-row gap-1 opacity-30">
                          <p className="font-semibold">{time}</p>
                          <p>3629 최재민</p>
                        </div>
                      ))
                    }
                  </div>
                  <p className="text-2xl font-bold">[{machine.grade.join(", ")}학년] {machine.name}</p>
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