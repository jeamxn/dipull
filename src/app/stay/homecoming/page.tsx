"use client";

import React from "react";

import { useAuth } from "@/hooks";

type Times = "school" | "dinner" | "yaja1" | "yaja2";
const times: Readonly<Times[]> = ["school", "dinner", "yaja1", "yaja2"];
const koreanTimes: Readonly<Record<Times, string>> = {
  school: "종례 후",
  dinner: "저녁시간",
  yaja1: "야자1 뒤",
  yaja2: "야자2 뒤",
};

const Stay = () => {
  const { user, needLogin, onlyStudent } = useAuth();
  const [reason, setReason] = React.useState("");
  const [time, setTime] = React.useState<Times>("school");

  const disabled = React.useMemo(() => !user.id || user.type !== "student", [user]);

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-4 w-full">
        <p className="px-4 text-xl font-semibold transition-all whitespace-nowrap text-text dark:text-text-dark">금요귀가 신청</p>

        <div className="flex flex-col gap-2 px-4">
          <p className="text-base font-normal transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">금요귀가 사유</p>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={[
              "w-full px-4 py-3 border border-text/20 dark:border-text-dark/30 rounded-xl outline-none text-text dark:text-text-dark",
              disabled ? "cursor-not-allowed bg-text/10 dark:bg-text-dark/20" : "bg-transparent",
            ].join(" ")}
            placeholder="금요귀가 사유를 입력해주세요."
            disabled={disabled}
          />
        </div>

        <div className="flex flex-col gap-2 px-4">
          <p className="text-base font-normal transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">귀가 시간 선택</p>
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
                    "w-full rounded-lg px-6 py-2 bg-transparent z-50",
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
      </div>

      <div className="w-full px-4">
        <button
          className={[
            "p-3 bg-text dark:bg-text-dark text-white dark:text-white-dark rounded-xl font-semibold w-full transition-all",
            reason ? "cursor-pointer" : "cursor-not-allowed opacity-50",
          ].join(" ")}
          disabled={!(reason)}
          onClick={!user.id ? needLogin : user.type === "student" ? () => {} : onlyStudent}
        >
        신청하기
          {/* {
          isFetching ? "신청 중..." : "신청하기"
        } */}
        </button>
      </div>
    </div>
  );
};

export default Stay;