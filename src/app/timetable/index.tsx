"use client";

import React from "react";

import * as Select from "@/components/Select";

const Timetable = () => {
  const [grade, setGrade] = React.useState<number>(1);
  const [class_, setClass] = React.useState<number>(1);
  return (
    <div className="px-6 flex flex-col gap-3">
      <div className="flex flex-row items-center justify-start gap-1">
        <p className="text-xl font-semibold">시간표</p>
        <p className="text-xl font-semibold">·</p>
        <Select.Title
          label="학반 선택하기"
          options={Array(3).fill(0).map((_, i) => `${i + 1}학년`)}
          optionValues={Array(3).fill(0).map((_, i) => i + 1)}
          value={grade}
          onConfirm={(t) => {
            setGrade(t || 1);
          }}
        />
        <Select.Title
          label="학반 선택하기"
          options={Array(6).fill(0).map((_, i) => `${i + 1}반`)}
          optionValues={Array(6).fill(0).map((_, i) => i + 1)}
          value={class_}
          onConfirm={(t) => {
            setClass(t || 1);
          }}
        />
      </div>
      <table className="w-full table-fixed bg-white dark:bg-text/15 rounded-2xl">
        <tbody className="w-full">
          <tr>
            <th className="w-8 py-2 text-blue-700 dark:text-blue-400 text-sm font-semibold border-r border-text/10 dark:border-text/20">-</th>
            <th className="px-2 py-2 text-blue-700 dark:text-blue-400 text-sm font-semibold">월</th>
            <th className="px-2 py-2 text-blue-700 dark:text-blue-400 text-sm font-semibold">화</th>
            <th className="px-2 py-2 text-blue-700 dark:text-blue-400 text-sm font-semibold">수</th>
            <th className="px-2 py-2 text-blue-700 dark:text-blue-400 text-sm font-semibold">목</th>
            <th className="px-2 py-2 text-blue-700 dark:text-blue-400 text-sm font-semibold">금</th>
          </tr>
              
          <tr className="border-t border-text/10 dark:border-text/20">
            <td className="py-3 text-text/60 text-sm font-normal border-r border-text/10 dark:border-text/20 text-center">1</td>
            <td className={[
              "px-1 py-3 whitespace-pre-line",
              // time.changed ? "bg-text/5 dark:bg-text/10" : "",
            ].join(" ")}>
              <p className="text-text/60 text-sm font-normal text-center whitespace-break-spaces break-all">
                <span className="flex flex-col gap-1 items-center justify-center">
                  <span className="text-text">DB</span>
                  <span className="text-text/60"> {"time.subject" && `${"임재"}□`}</span>
                </span>
              </p>
            </td>
            <td className={[
              "px-1 py-3 whitespace-pre-line",
              // time.changed ? "bg-text/5 dark:bg-text/10" : "",
            ].join(" ")}>
              <p className="text-text/60 text-sm font-normal text-center whitespace-break-spaces break-all">
                <span className="flex flex-col gap-1 items-center justify-center">
                  <span className="text-text">DB</span>
                  <span className="text-text/60"> {"time.subject" && `${"임재"}□`}</span>
                </span>
              </p>
            </td>
            <td className={[
              "px-1 py-3 whitespace-pre-line",
              // time.changed ? "bg-text/5 dark:bg-text/10" : "",
            ].join(" ")}>
              <p className="text-text/60 text-sm font-normal text-center whitespace-break-spaces break-all">
                <span className="flex flex-col gap-1 items-center justify-center">
                  <span className="text-text">DB</span>
                  <span className="text-text/60"> {"time.subject" && `${"임재"}□`}</span>
                </span>
              </p>
            </td>
            <td className={[
              "px-1 py-3 whitespace-pre-line",
              // time.changed ? "bg-text/5 dark:bg-text/10" : "",
            ].join(" ")}>
              <p className="text-text/60 text-sm font-normal text-center whitespace-break-spaces break-all">
                <span className="flex flex-col gap-1 items-center justify-center">
                  <span className="text-text">DB</span>
                  <span className="text-text/60"> {"time.subject" && `${"임재"}□`}</span>
                </span>
              </p>
            </td>
            <td className={[
              "px-1 py-3 whitespace-pre-line",
              // time.changed ? "bg-text/5 dark:bg-text/10" : "",
            ].join(" ")}>
              <p className="text-text/60 text-sm font-normal text-center whitespace-break-spaces break-all">
                <span className="flex flex-col gap-1 items-center justify-center">
                  <span className="text-text">DB</span>
                  <span className="text-text/60"> {"time.subject" && `${"임재"}□`}</span>
                </span>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;