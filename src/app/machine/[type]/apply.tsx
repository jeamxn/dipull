import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import moment from "moment";
import React from "react";

import { useAlertModalDispatch } from "@/components/AlertModal";
import * as Select from "@/components/Select";
import { useAuth } from "@/hooks";
import { Machine as MachineInfo, Machine_list, MachineJoin, UserInfo, defaultUser } from "@/utils/db/utils";

import { MachineApplyResponse } from "./grant/apply/[id]/utils";
import { Machine_list_Response } from "./list/[allow]/utils";
import { MachineType, machineTypeToKorean } from "./utils";

const Apply = ({
  params,
  machines,
  machinesLoading,
  machine_current,
  machine_currentLoading,
  refetchMachineCurrent,
  times,
  selected,
  setSelected,
}: {
    selected: UserInfo;
    setSelected: React.Dispatch<React.SetStateAction<UserInfo>>;
    params: { type: MachineType };
    machines: Machine_list_Response[] | undefined;
    machinesLoading: boolean;
    machine_current: MachineJoin[] | undefined;
    machine_currentLoading: boolean;
    refetchMachineCurrent: () => void;
    times: MachineInfo["time"][];
  }) => {
  const { needLogin, user } = useAuth();

  const current_korean = machineTypeToKorean(params.type);
  const [machine, setMachine] = React.useState<MachineInfo["code"]>();
  const [time, setTime] = React.useState<MachineInfo["time"]>();

  const { refetch, isFetching } = useQuery({
    queryKey: ["machine_put", params.type, machine, time, selected.id],
    queryFn: async () => {
      const response = await axios.put<MachineApplyResponse>(`/machine/${params.type}/grant/apply/${selected.id}`, {
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

  const time_disables = React.useMemo(() => { 
    try {
      machine_current?.map(e => e);
    }
    catch {
      return [];
    }
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
        disables={machines?.map((m) => {
          const grade = Math.floor(selected.number / 1000);
          if(!m.allow.includes(grade) && selected.id === user.id) {
            return true;
          }
          if (m.gender !== selected.gender) return true;
          return false;
        })}
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
      <div className="px-4 w-full">
        <button
          className={[
            "p-3 bg-text dark:bg-text-dark text-white dark:text-white-dark rounded-xl font-semibold w-full transition-all",
            machine && time && !isFetching ? "cursor-pointer" : "cursor-not-allowed opacity-50",
          ].join(" ")}
          disabled={!machine || !time}
          onClick={user.id ? () => refetch() : needLogin}
        >
          {
            isFetching ? "신청 중..." : "신청하기"
          }
        </button>
      </div>
    </>
  );
};

export default Apply;