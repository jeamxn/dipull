import moment from "moment";
import React from "react";

import { Machine_list, MachineJoin } from "@/utils/db/utils";

import { MachineType, machineTypeToKorean } from "./utils";

const MyApply = ({
  params,
  machines,
  machinesLoading,
  myApply,
}: {
    params: { type: MachineType };
    machines: Machine_list[] | undefined;
    machinesLoading: boolean;
    myApply: MachineJoin | undefined;
  }) => {
  return (
    <div className="w-full px-6 flex flex-col items-center justify-center gap-4">
      <div className="w-full flex flex-col items-center justify-center gap-1">
        <p className="font-semibold text-xl text-text dark:text-text-dark">오늘 예약한 {machineTypeToKorean(params.type)}기가 있어요.</p>
        <div className="flex flex-row gap-1">
          <p className="text-text dark:text-text-dark">{machines?.find((m) => myApply?.code === m.code)?.name}</p>
          <p className="text-text dark:text-text-dark">{moment(myApply?.time, "HH:mm").format("a h시 mm분")}</p>
        </div>
      </div>
      <div className="w-full flex flex-row items-center justify-center gap-1">
        <button
          className={[
            "px-3 py-2.5 text-text dark:text-text-dark border border-text dark:border-text-dark bg-transparent rounded-xl font-semibold w-full transition-all",
            // machine && time ? "cursor-pointer" : "cursor-not-allowed opacity-50",
          ].join(" ")}
          // disabled={!machine || !time}
          // onClick={user.id ? () => { } : needLogin}
        >지연신청</button>
        <button
          className={[
            "px-3 py-2.5 bg-text dark:bg-text-dark border border-text dark:border-text-dark text-white dark:text-white-dark rounded-xl font-semibold w-full transition-all",
            // machine && time ? "cursor-pointer" : "cursor-not-allowed opacity-50",
          ].join(" ")}
          // disabled={!machine || !time}
          // onClick={user.id ? () => { } : needLogin}
        >취소하기</button>
      </div>
    </div>
  );
};

export default MyApply;