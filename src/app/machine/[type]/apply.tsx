import moment from "moment";
import React from "react";

import * as Select from "@/components/Select";
import { useAuth, useUserInfo } from "@/hooks";
import { Machine as MachineInfo, Machine_list, MachineJoin } from "@/utils/db/utils";

import { MachineType, machineTypeToKorean } from "./utils";

const Apply = ({
  params,
  machines,
  machinesLoading,
  machine_current,
  machine_currentLoading,
  times,
}: {
    params: { type: MachineType };
    machines: Machine_list[] | undefined;
    machinesLoading: boolean;
    machine_current: MachineJoin[] | undefined;
    machine_currentLoading: boolean;
    times: MachineInfo["time"][];
  }) => {
  const user = useUserInfo();
  const { needLogin } = useAuth();
  const current_korean = machineTypeToKorean(params.type);
  const [machine, setMachine] = React.useState<MachineInfo["code"]>();
  const [time, setTime] = React.useState<MachineInfo["time"]>();

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
    </>
  );
};

export default Apply;