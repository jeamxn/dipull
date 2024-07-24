"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React from "react";

import Linker from "@/components/Linker";
import { useAuth } from "@/hooks";
import { getUserInfo } from "@/utils/cookies";
import { MachineJoin } from "@/utils/db/utils";

import Apply from "./apply";
import { Machine_list_Response } from "./list/utils";
import MachineInfo from "./machineInfo";
import MyApply from "./myApply";
import { MachineType, machineTypeToKorean } from "./utils";

const Machine = ({ params }: { params: { type: MachineType } }) => {
  const { user } = useAuth();
  const current_korean = machineTypeToKorean(params.type);

  const { data: machines, isFetching: machinesLoading } = useQuery({
    queryKey: ["machine_list", params.type],
    queryFn: async () => {
      const response = await axios.get<Machine_list_Response[]>(`/machine/${params.type}/list`);
      return response.data;
    },
    initialData: [],
  });

  const { data: times } = useQuery({
    queryKey: ["time_list", params.type],
    queryFn: async () => {
      const response = await axios.get<string[]>(`/machine/${params.type}/time`);
      return response.data;
    },
    initialData: [],
  });

  const { data: machine_current, isFetching: machine_currentLoading, refetch: refetchMachineCurrent } = useQuery({
    queryKey: ["machine_current", params.type, user.id],
    queryFn: async () => {
      const response = await axios.get<MachineJoin[]>(`/machine/${params.type}/grant/current`);
      return response.data;
    },
    enabled: Boolean(user.id),
    initialData: [],
  });

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
      <div className="flex flex-row items-center justify-center gap-1 px-4 w-full">
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
        <p className="text-lg font-semibold px-4 text-text dark:text-text-dark">{current_korean}기 신청하기</p>
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
        <p className="text-lg font-semibold px-4 text-text dark:text-text-dark">{current_korean} 신청 현황</p>
        <div className="flex flex-col w-max gap-4 px-4">
          {
            !machine_currentLoading ? machines.length ? machines.map((machine, index) => (
              <MachineInfo
                key={index}
                machine={machine}
                times={times}
                machine_current={machine_current}
              />
            )) : (
              <div
                className={[
                  "snap-center rounded-2xl p-6 bg-white dark:bg-text-dark/15 flex flex-col items-start justify-end gap-2 w-[calc(30rem)] max-md:w-[max(calc(100vw-2rem),250px)] h-max",
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
                  "snap-center rounded-2xl p-6 bg-white dark:bg-text-dark/15 flex flex-col items-start justify-end gap-2 w-[calc(30rem)] max-md:w-[max(calc(100vw-2rem),250px)] h-max",
                ].join(" ")}
              >
                <div className={[
                  "flex flex-row gap-1 opacity-30",
                ].join(" ")}>
                  <p className="text-text dark:text-text-dark">{machineTypeToKorean(params.type)} 현황을 불러노는 중...</p>
                </div>
              </div>
            )
          }
        </div>
      </div>
      
    </div>
  );
};

export default Machine;