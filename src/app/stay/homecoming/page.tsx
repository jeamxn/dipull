"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

import SelectUser from "@/components/SelectUser";
import { useAuth } from "@/hooks";
import { defaultUser, UserInfo } from "@/utils/db/utils";

import { HomecomingResponse } from "./grant/[id]/utils";
import { koreanTimes, times, Times } from "./utils";

const Stay = () => {
  const { user, needLogin, onlyStudent } = useAuth();
  const [selected, setSelected] = React.useState<UserInfo>(defaultUser);
  React.useEffect(() => {
    setSelected(user);
  }, [user]);

  const [reason, setReason] = React.useState("");
  const [time, setTime] = React.useState<Times>("school");

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["homecoming_get", user.id, selected.id],
    queryFn: async () => {
      const response = await axios.get<HomecomingResponse>(`/stay/homecoming/grant/${selected.id}`);
      const { data: res } = response.data;
      setReason(res?.reason || "");
      setTime(res?.time || "school");
      return res;
    },
    enabled: Boolean(selected.id && selected.type === "student"),
  });

  const { refetch: refetchPut, isFetching: isFetchingPut } = useQuery({
    queryKey: ["homecoming_put", time, reason, user.id, selected.id],
    queryFn: async () => {
      const response = await axios.put<HomecomingResponse>(`/stay/homecoming/grant/${selected.id}`, {
        reason,
        time,
      });
      await refetch();
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });

  const { refetch: refetchDelete, isFetching: isFetchingDelete } = useQuery({
    queryKey: ["homecoming_delete", time, reason, user.id],
    queryFn: async () => {
      const response = await axios.delete<HomecomingResponse>(`/stay/homecoming/grant/${selected.id}`);
      await refetch();
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });

  const disabled = React.useMemo(() => {
    return Boolean(isFetchingPut || data?.reason || isFetching);
  }, [isFetchingPut, data?.reason, isFetching]);

  return (
    <div className="flex flex-col gap-8 w-full overflow-hidden">
      <div className="flex flex-col gap-4 w-full">
        <p className="px-4 text-xl font-semibold transition-all whitespace-nowrap text-text dark:text-text-dark">금요귀가 신청</p>
        {
          user.type === "teacher" ? (
            <div className="w-full px-4">
              <SelectUser select={selected} setSelect={setSelected} />
            </div>
          ) : null
        }
        <div className="flex flex-col gap-2 px-4">
          <p className="text-base font-medium transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">금요귀가 사유</p>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={[
              "w-full px-4 py-3 border border-text/20 dark:border-text-dark/30 rounded-xl outline-none text-text dark:text-text-dark",
              disabled ? "cursor-not-allowed bg-text/10 dark:bg-text-dark/20" : "bg-transparent",
            ].join(" ")}
            placeholder={isFetching ? "금요귀가 정보를 불러오는 중..." : "금요귀가 사유를 입력해주세요."}
            disabled={disabled}
          />
        </div>

        <div className="flex flex-col gap-2 px-4">
          <p className="text-base font-medium transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">귀가 시간 선택</p>
          <div className={[
            "p-1.5 rounded-xl w-full flex flex-row gap-2 relative border border-text/20 dark:border-text-dark/30",
            disabled ? "cursor-not-allowed bg-text/10 dark:bg-text-dark/20" : "bg-transparent",
          ].join(" ")}>
            <div
              className={[
                "absolute left-0 top-0 bottom-0 flex flex-row items-center justify-start w-full rounded-xl pointer-events-none p-1.5 transition-all duration-100",
                time === "school" ? "" : time === "dinner" ? "translate-x-[calc(25%-0.25rem)]" : time === "yaja1" ? "translate-x-[calc(50%-0.25rem)]" : "translate-x-[calc(75%-0.25rem)]",
              ].join(" ")}
            >
              <div className="bg-text dark:bg-text-dark w-[calc(25%-0.25rem)] h-full rounded-lg" />
            </div>
            {
              times.map((_) => (
                <button
                  key={_}
                  className={[
                    "w-full rounded-lg py-2 bg-transparent z-50",
                    disabled ? "cursor-not-allowed opacity-50" : "",
                  ].join(" ")}
                  onClick={() => {
                    setTime(_);
                  }}
                  disabled={disabled}
                >
                  <p className={[
                    "text-lg font-medium duration-100",
                    _ === time ? "text-white dark:text-white-dark" : "text-text/30 dark:text-text-dark/40",
                  ].join(" ")}>
                    {koreanTimes[_]}
                  </p>
                </button>
              ))
            }
          </div>
        </div>

        <div className="flex flex-col gap-1 px-4">
          <p className="text-base font-medium transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">금요귀가 신청 현황</p>
          <p className="text-lg font-semibold transition-all whitespace-nowrap text-text dark:text-text-dark">
            <a href="https://docs.google.com/spreadsheets/d/1TWnV8rk39ukaWG0JqHbteC8sG6PrDYku0u7lXvmg33k/edit?gid=0#gid=0" className="underline" target="_blank" rel="noreferrer">여기</a>에서 금요귀가 신청 현황을 확인하세요!
          </p>
        </div>
      </div>

      <div className="w-full px-4">
        {
          data?.reason ? (
            <button
              className={[
                "p-3 bg-transparent border border-red-500 dark:bg-transparent dark:border-red-500 text-red-500 dark:text-red-500 rounded-xl font-semibold w-full transition-all",
                isFetchingDelete ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              ].join(" ")}
              disabled={isFetchingDelete}
              onClick={!user.id ? needLogin : () => refetchDelete()}
            >
              {
                isFetchingDelete ? "취소 중..." : "취소하기"
              }
            </button>
          ): (
            <button
              className={[
                "p-3 bg-text dark:bg-text-dark text-white dark:text-white-dark rounded-xl font-semibold w-full transition-all",
                !reason || disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              ].join(" ")}
              disabled={!reason || disabled}
              onClick={!user.id ? needLogin : () => refetchPut()}
            >
              {
                isFetchingPut ? "신청 중..." : "신청하기"
              }
            </button>
          )
        }
      </div>
    </div>
  );
};

export default Stay;