"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React from "react";

import Linker from "@/components/Linker";
import { useAuth } from "@/hooks";
import { getUserInfo } from "@/utils/cookies";
import { Machine_list_Response, MachineJoin } from "@/utils/db/utils";

import Apply from "./apply";
import MyApply from "./myApply";
import { MachineType, machineTypeToKorean } from "./utils";

const Machine = ({ params }: { params: { type: MachineType } }) => {
  const { user } = useAuth();
  const current_korean = machineTypeToKorean(params.type);

  const { data: machines, isLoading: machinesLoading } = useQuery({
    queryKey: ["machine_list", params.type],
    queryFn: async () => {
      const response = await axios.get<Machine_list_Response[]>(`/machine/${params.type}/list`);
      return response.data;
    },
    initialData: [],
  });

  const { data: machine_current, isLoading: machine_currentLoading, refetch: refetchMachineCurrent } = useQuery({
    queryKey: ["machine_current", params.type, user.id],
    queryFn: async () => {
      const response = await axios.get<MachineJoin[]>(`/machine/${params.type}/grant/current`);
      return response.data;
    },
    enabled: Boolean(user.id),
    initialData: [],
  });

  const times = [
    "18:35",
    "19:35",
    "20:30",
    "21:30",
    "22:30",
  ];

  const myApply = React.useMemo(() => { 
    if (!user.id) return;
    try {
      const find = machine_current.find((m) => m.owner.id === user.id);
      return find;
    }
    catch {
      return undefined;
    }
  }, [user.id, machine_current]);

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
        {
          myApply?.code ? (
            <MyApply
              params={params}
              machines={machines}
              machinesLoading={machinesLoading}
              myApply={myApply}
              refetchMachineCurrent={refetchMachineCurrent}
            />
          ) : (
            <Apply
              params={params}
              machines={machines}
              machinesLoading={machinesLoading}
              machine_current={machine_current}
              machine_currentLoading={machine_currentLoading}
              refetchMachineCurrent={refetchMachineCurrent}
              times={times}
            />
          )
        }
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold px-6 text-text dark:text-text-dark">{current_korean} 신청 현황</p>
        <div className="px-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory">
          <div className="flex flex-row w-max gap-1.5">
            {
              !machine_currentLoading ? machines.length ? machines.map((machine, index) => (
                <div
                  className={[
                    "snap-center rounded-2xl p-6 bg-white dark:bg-text-dark/15 flex flex-col items-start justify-end gap-2 w-[calc(29rem)] max-md:w-[max(calc(100vw-3rem),250px)] h-max",
                  ].join(" ")}
                  key={index}
                >
                  <div className="flex flex-col gap-0.5">
                    {
                      user.id ? times.map((time, i) => {
                        const this_user = () => {
                          try {
                            return machine_current?.find((item) => item.time === time && item.code === machine.code);
                          }
                          catch {
                            return undefined;
                          }
                        };
                        return (
                          <div key={i} className={[
                            "flex flex-row gap-1",
                            this_user() ? "opacity-90" : "opacity-30",
                          ].join(" ")}>
                            <p className="font-semibold text-text dark:text-text-dark">{moment(time, "HH:mm").format("a h시 mm분")}</p>
                            <p className="text-text dark:text-text-dark">{this_user()?.owner.number} {this_user()?.owner.name}</p>
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
                  <p className="text-2xl font-bold text-text dark:text-text-dark">[{machine.allow.join(", ")}학년] {machine.name}</p>
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
                    <p className="text-text dark:text-text-dark">등록된 {machineTypeToKorean(params.type)}기가 없습니다.</p>
                  </div>
                </div>
              ) : (
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