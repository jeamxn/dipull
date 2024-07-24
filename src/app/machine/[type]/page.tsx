"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React from "react";

import Linker from "@/components/Linker";
import * as Select from "@/components/Select";
import { useAuth, useUserInfo } from "@/hooks";
import { Machine as MachinType, Machine_list, MachineJoin } from "@/utils/db/utils";

import { MachineType, machineTypeToKorean } from "./utils";

const Machine = ({ params }: { params: { type: MachineType } }) => {
  const user = useUserInfo();
  const { needLogin } = useAuth();
  const current_korean = machineTypeToKorean(params.type);
  const [machine, setMachine] = React.useState<MachinType["code"]>();
  const [time, setTime] = React.useState<MachinType["time"]>();

  const { data: machines, isLoading: machinesLoading } = useQuery({
    queryKey: ["machine_list", { type: params.type }],
    queryFn: async () => {
      const response = await axios.get<Machine_list[]>(`/machine/${params.type}/list`);
      return response.data;
    },
  });

  const { data: machine_current, isLoading: machine_currentLoading } = useQuery({
    queryKey: ["machine_current", { type: params.type }],
    queryFn: async () => {
      const response = await axios.get<MachineJoin[]>(`/machine/${params.type}/grant/current`);
      return response.data;
    },
    enabled: Boolean(user.id),
  });

  const times = [
    "18:35",
    "19:35",
    "20:30",
    "21:30",
    "22:30",
  ];

  const time_disables = React.useMemo(() => { 
    const mapped = machine_current?.map((m) => {
      if (m.code === machine) {
        return m.time;
      }
      else {
        return null;
      }
    });
    const filtered = mapped?.filter((m) => m);
    const timesMaped = times.map((time) => { 
      if (filtered?.includes(time)) {
        return true;
      }
      else {
        return false;
      }
    });
    return timesMaped || [];
  }, [machine_current, machine]);

  return (
    <div className="w-full py-6 flex flex-col gap-6">
      <div className="flex flex-row items-center justify-center gap-1 px-6 w-full">
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
          options={machines?.map((m) => m.name)}
          optionValues={machines?.map((m) => m.code)}
          value={machine}
          onConfirm={(value) => setMachine(value)}
          disabled={machinesLoading}
        />
        <Select.Full
          label={`${current_korean} 시간 선택`}
          placeholder={`${current_korean} 시간을 선택해주세요.`}
          options={times.map((time) => moment(time, "HH:mm").format("a h시 mm분"))}
          optionValues={times}
          value={time}
          onConfirm={(value) => setTime(value)}
          disables={time_disables}
          disabled={!machine || machine_currentLoading}
        />
        <div className="px-6 w-full">
          <button
            className={[
              "p-3 bg-text dark:bg-text-dark text-white dark:text-white-dark rounded-xl font-semibold w-full transition-all",
              machine && time ? "cursor-pointer" : "cursor-not-allowed opacity-50",
            ].join(" ")}
            disabled={!machine || !time}
            onClick={user.id ? () => { } : needLogin}
          >신청하기</button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold px-6 text-text dark:text-text-dark">{current_korean} 신청 현황</p>
        <div className="px-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory">
          <div className="flex flex-row w-max gap-1.5">
            {
              machines && machines.length && !machine_currentLoading ? machines.map((machine, index) => (
                <div
                  className={[
                    "snap-center rounded-2xl p-6 bg-white dark:bg-text-dark/15 flex flex-col items-start justify-end gap-2 w-[calc(29rem)] max-md:w-[max(calc(100vw-3rem),250px)] h-max",
                  ].join(" ")}
                  key={index}
                >
                  <div className="flex flex-col gap-0.5">
                    {
                      user.id ? times.map((time, i) => {
                        const this_user = machine_current?.find((item) => item.time === time && item.code === machine.code);
                        return (
                          <div key={i} className={[
                            "flex flex-row gap-1",
                            this_user ? "opacity-90" : "opacity-30",
                          ].join(" ")}>
                            <p className="font-semibold text-text dark:text-text-dark">{moment(time, "HH:mm").format("a h시 mm분")}</p>
                            <p className="text-text dark:text-text-dark">{this_user?.owner.number} {this_user?.owner.name}</p>
                          </div>
                        );
                      }) : (
                        <div className={[
                          "flex flex-row gap-1 opacity-30",
                        ].join(" ")}>
                          <p className="text-text dark:text-text-dark">로그인 후 확인 가능합니다.</p>
                        </div>
                      )
                    }
                  </div>
                  <p className="text-2xl font-bold text-text dark:text-text-dark">[{machine.allow.default.join(", ")}학년] {machine.name}</p>
                </div>
              )) : (
                <div
                  className={[
                    "snap-center rounded-2xl p-6 bg-white dark:bg-text-dark/15 flex flex-col items-start justify-end gap-2 w-[calc(29rem)] max-md:w-[max(calc(100vw-3rem),250px)] h-max",
                  ].join(" ")}
                >
                  <div className={[
                    "flex flex-row gap-1 opacity-30",
                  ].join(" ")}>
                    <p className="text-text dark:text-text-dark">로딩 중 입니다...</p>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Machine;