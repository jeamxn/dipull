"use client";

import React from "react";

import Linker from "@/components/Linker";
import Select from "@/components/Select";

import { MachineType, machineTypeToKorean } from "./utils";

function Home({ params }: { params: { type: MachineType } }) {
  const current_korean = machineTypeToKorean(params.type);
  const [machine, setMachine] = React.useState<string>();
  const [time, setTime] = React.useState<string>();

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
        <Select
          label={`${current_korean}기 선택`}
          placeholder={`${current_korean}기를 선택해주세요.`}
          options={[
            "[3학년] 학봉관 2층 중앙",
            "[3학년] 학봉관 2층 왼쪽",
          ]}
          value={machine}
          onClick={(value) => setMachine(value)}
        />
        <Select
          label={`${current_korean} 시간 선택`}
          placeholder={`${current_korean} 시간을 선택해주세요.`}
          options={[
            "오후 6시 35분",
            "오후 7시 35분",
            "오후 8시 30분",
            "오후 9시 30분",
            "오후 10시 30분",
          ]}
          value={time}
          onClick={(value) => setTime(value)}
        />
      </div>
      
      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold px-6">{current_korean} 신청 현황</p>
      </div>
      
    </div>
  );
}

export default Home;