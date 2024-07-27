import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import moment from "moment";
import React from "react";

import { useAlertModalDispatch } from "@/components/AlertModal";
import { useAuth } from "@/hooks";
import { MachineJoin, UserInfo } from "@/utils/db/utils";

import { MachineApplyResponse } from "./grant/apply/[id]/utils";
import { Machine_list_Response } from "./list/[allow]/utils";
import { MachineType, machineTypeToKorean } from "./utils";

const MyApply = ({
  params,
  machines,
  machinesLoading,
  myApply,
  refetchMachineCurrent,
  selected,
  setSelected,
}: {
    params: { type: MachineType };
    machines: Machine_list_Response[] | undefined;
    machinesLoading: boolean;
    myApply: MachineJoin | undefined;
    refetchMachineCurrent: () => void;
    selected: UserInfo;
    setSelected: React.Dispatch<React.SetStateAction<UserInfo>>;
  }) => {
  const { needLogin, user } = useAuth();
  const alertModalDispatch = useAlertModalDispatch();

  const late = () => {
    alertModalDispatch({
      type: "show",
      data: {
        title: "아직 지원되지 않아요.",
        description: "빠른 시일 내로 개발할 예정입니다.",
      },
    });
  };

  const { refetch, isFetching } = useQuery({
    queryKey: ["machine_put", params.type, selected.id],
    queryFn: async () => {
      const response = await axios.delete<MachineApplyResponse>(`/machine/${params.type}/grant/apply/${selected.id}`);
      refetchMachineCurrent();
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });
  
  return (
    <div className="w-full px-4 flex flex-col items-center justify-center gap-4">
      <div className="py-5 w-full flex flex-col items-center justify-center gap-1">
        <p className="font-semibold text-xl text-text dark:text-text-dark">오늘 예약한 {machineTypeToKorean(params.type)}기가 있어요.</p>
        <div className="flex flex-row gap-1">
          <p className="text-text dark:text-text-dark">{machines?.find((m) => myApply?.code === m.code)?.name}</p>
          <p className="text-text dark:text-text-dark">{moment(myApply?.time, "HH:mm").format("a h시 mm분")}</p>
        </div>
      </div>
      <div className="w-full flex flex-row items-center justify-center gap-1">
        <button
          className={[
            "px-3 py-2.5 text-text dark:text-text-dark border border-text dark:border-text-dark bg-transparent rounded-xl font-semibold w-full transition-all cursor-pointer",
          ].join(" ")}
          onClick={user.id ? late : needLogin}
        >지연신청</button>
        <button
          className={[
            "px-3 py-2.5 bg-text dark:bg-text-dark border border-text dark:border-text-dark text-white dark:text-white-dark rounded-xl font-semibold w-full transition-all",
            !isFetching ? "cursor-pointer" : "cursor-not-allowed opacity-50",
          ].join(" ")}
          onClick={user.id ? () => refetch() : needLogin}
        >
          {
            isFetching ? "취소 중..." : "취소하기"
          }
        </button>
      </div>
    </div>
  );
};

export default MyApply;