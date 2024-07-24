import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import moment from "moment";
import React from "react";

import { useAlertModalDispatch } from "@/components/AlertModal";
import * as Select from "@/components/Select";
import { useAuth, useUserInfo } from "@/hooks";
import { Machine as MachineInfo, Machine_list, MachineJoin, Machine_list_Response } from "@/utils/db/utils";

import { MachineApplyResponse } from "./grant/apply/utils";
import { MachineType, machineTypeToKorean } from "./utils";

const Apply = ({
  params,
  machines,
  machinesLoading,
  machine_current,
  machine_currentLoading,
  refetchMachineCurrent,
  times,
}: {
    params: { type: MachineType };
    machines: Machine_list_Response[] | undefined;
    machinesLoading: boolean;
    machine_current: MachineJoin[] | undefined;
    machine_currentLoading: boolean;
    refetchMachineCurrent: () => void;
    times: MachineInfo["time"][];
  }) => {
  const user = useUserInfo();
  const { needLogin } = useAuth();
  const current_korean = machineTypeToKorean(params.type);
  const [machine, setMachine] = React.useState<MachineInfo["code"]>();
  const [time, setTime] = React.useState<MachineInfo["time"]>();
  const alertModalDispatch = useAlertModalDispatch();

  const { refetch, error } = useQuery({
    queryKey: ["machine_put", { type: params.type }],
    queryFn: async () => {
      const response = await axios.put<MachineApplyResponse>(`/machine/${params.type}/grant/apply`, {
        machine,
        time,
      });
      refetchMachineCurrent();
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });
  
  React.useEffect(() => {
    if(!error) return;
    const axiosError = error as unknown as AxiosError<MachineApplyResponse>;
    alertModalDispatch({
      type: "show",
      data: {
        title: axiosError.response?.data.message || "오류가 발생했습니다.",
        description: "다시 시도해주세요.",
      },
    });
  }, [error]);

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
    <>
      <Select.Full
        label={`${current_korean}기 선택`}
        placeholder={`${current_korean}기를 선택해주세요.`}
        options={machines?.map((m) => `[${m.allow.join(", ")}학년] ${m.name}`)}
        disables={machines?.map((m) => !m.allow.includes(Math.floor(user.number / 1000)))}
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
          onClick={user.id ? () => refetch() : needLogin}
        >신청하기</button>
      </div>
    </>
  );
};

export default Apply;