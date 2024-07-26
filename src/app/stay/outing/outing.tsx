import React from "react";

import { OutingInfo, sundayOuting } from "./utils";

const Outing = ({
  select,
  setSelect,
}: {
    select: OutingInfo,
    setSelect: React.Dispatch<React.SetStateAction<OutingInfo>>;
  }) => {
  const [reason, setReason] = React.useState("");
  return (
    <div className="w-full flex flex-col gap-4 overflow-hidden">
      <div className="p-1.5 rounded-xl w-full flex flex-row gap-2 relative border border-text/20 dark:border-text-dark/30">
        <div className={[
          "absolute left-0 top-0 bottom-0 flex flex-row items-center justify-center w-full rounded-xl pointer-events-none p-1.5 transition-all duration-100",
          select.day === "saturday" ? "-translate-x-1/4 ml-[0.0625rem]" : "translate-x-1/4 -ml-[0.0625rem]",
        ].join(" ")}>
          <div className="bg-text dark:bg-text-dark w-[calc(50%-0.25rem)] h-full rounded-lg" />
        </div>
        {
          ["토요일", "일요일"].map((day) => (
            <button
              key={day}
              className={[
                "w-full rounded-lg px-6 py-2 bg-transparent z-50",
              ].join(" ")}
              onClick={() => {
                setSelect({
                  ...select,
                  day: day === "토요일" ? "saturday" : "sunday",
                });
              }}
            >
              <p className={[
                "text-lg font-medium duration-100",
                select.day === (day === "토요일" ? "saturday" : "sunday") ? "text-white dark:text-white-dark" : "text-text/30 dark:text-text-dark/40",
              ].join(" ")}>
                {day}
              </p>
            </button>
          ))
        }
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-base font-normal transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">외출 시간</p>
        <div className="flex flex-row items-center justify-center gap-2">
          <input
            type="time"
            value={select.start}
            onChange={(e) => {
              setSelect({
                ...select,
                start: e.target.value,
              });
            }}
            className={[
              "w-full px-4 py-3 border border-text/20 dark:border-text-dark/30 rounded-xl outline-none text-text dark:text-text-dark bg-transparent",
            ].join(" ")}
          />
          <p className="text-text/30 dark:text-text-dark/40 text-center">~</p>
          <input
            type="time"
            value={select.end}
            onChange={(e) => {
              setSelect({
                ...select,
                end: e.target.value,
              });
            }}
            className={[
              "w-full px-4 py-3 border border-text/20 dark:border-text-dark/30 rounded-xl outline-none text-text dark:text-text-dark",
              !select.start ? "cursor-not-allowed bg-text/10 dark:bg-text-dark/20" : "bg-transparent",
            ].join(" ")}
            disabled={!select.start}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-base font-normal transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">외출 사유</p>
        <div className="flex flex-row items-center justify-center gap-2">
          <input
            type="text"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setSelect({
                ...select,
                reason: e.target.value,
              });
            }}
            className={[
              "w-full px-4 py-3 border border-text/20 dark:border-text-dark/30 rounded-xl outline-none text-text dark:text-text-dark bg-transparent",
            ].join(" ")}
            placeholder="외출 사유를 입력해주세요."
          />
          {
            select.day === "sunday" ? (
              <button
                className="rounded-xl px-6 py-3 bg-text dark:bg-text-dark border border-text dark:border-text-dark text-white dark:text-white-dark"
                onClick={() => {
                  setReason("자기계발외출");
                  setSelect(sundayOuting);
                }}
              >
                자기계발외출
              </button>
            ) : null
          }
        </div>
      </div>
      <div />
    </div>
  );
};

export default Outing;