import React from "react";

import { OutingInfo } from "./page";

const Outing = ({
  select,
  setSelect,
}: {
    select: OutingInfo,
    setSelect: React.Dispatch<React.SetStateAction<OutingInfo>>;
}) => { 
  const [day, setDay] = React.useState<OutingInfo["day"]>(select.day);
  const [reason, setReason] = React.useState<OutingInfo["reason"]>(select.reason);
  const [start, setStart] = React.useState<OutingInfo["start"]>(select.start);
  const [end, setEnd] = React.useState<OutingInfo["end"]>(select.end);

  React.useEffect(() => { 
    setDay(select.day);
    setReason(select.reason);
    setStart(select.start);
    setEnd(select.end);
  }, [select]);

  React.useEffect(() => {
    setSelect({
      day,
      start,
      end,
      reason,
    });
  }, [day, start, end, reason]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="p-1.5 rounded-xl w-full flex flex-row gap-2 relative border border-text/20 dark:border-text-dark/30">
        <div className={[
          "absolute left-0 top-0 bottom-0 flex flex-row items-center justify-center w-full rounded-xl pointer-events-none p-1.5 transition-all duration-100",
          day === "saturday" ? "-translate-x-1/4 ml-[0.0625rem]" : "translate-x-1/4 -ml-[0.0625rem]",
        ].join(" ")}>
          <div className="bg-text dark:bg-text-dark w-[calc(50%-0.25rem)] h-full rounded-lg" />
        </div>
        <button
          className={[
            "w-full rounded-lg px-6 py-2 bg-transparent z-50",
          ].join(" ")}
          onClick={() => setDay("saturday")}
        >
          <p className={[
            "text-lg font-medium duration-100",
            day === "saturday" ? "text-white dark:text-white-dark" : "text-text/30 dark:text-text-dark/40",
          ].join(" ")}>토요일</p>
        </button>
        <button
          className={[
            "w-full rounded-lg px-6 py-2 bg-transparent z-50",
          ].join(" ")}
          onClick={() => setDay("sunday")}
        >
          <p className={[
            "text-lg font-medium duration-100",
            day === "sunday" ? "text-white dark:text-white-dark" : "text-text/30 dark:text-text-dark/40",
          ].join(" ")}>일요일</p>
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-base font-normal transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">외출 시간</p>
        <div className="flex flex-row items-center justify-center gap-2">
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className={[
              "w-full px-4 py-3 border border-text/20 dark:border-text-dark/30 rounded-xl outline-none text-text dark:text-text-dark bg-transparent",
            ].join(" ")}
          />
          <p className="text-text/30 dark:text-text-dark/40 text-center">~</p>
          <input
            type="time"
            value={end}
            onChange={(e) => {
              if (e.target.value < start) return;
              setEnd(e.target.value);
            }}
            className={[
              "w-full px-4 py-3 border border-text/20 dark:border-text-dark/30 rounded-xl outline-none text-text dark:text-text-dark",
              !start ? "cursor-not-allowed bg-text/10 dark:bg-text-dark/20" : "bg-transparent",
            ].join(" ")}
            disabled={!start}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-base font-normal transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">외출 사유</p>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={[
            "w-full px-4 py-3 border border-text/20 dark:border-text-dark/30 rounded-xl outline-none text-text dark:text-text-dark cursor-pointer bg-transparent",
          ].join(" ")}
          placeholder="외출 사유를 입력해주세요."
        />
      </div>

      <div />
    </div>
  );
};

export default Outing;