"use client";

import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import React from "react";

import { UserInfo } from "@/app/api/teacher/userinfo/utils";
import { TimetableResponse } from "@/app/api/timetable/[grade]/[class]/get";
import instance from "@/utils/instance";

const Timetable = ({
  init,
  userInfo,
}: {
  init: TimetableResponse["data"];
  userInfo: UserInfo;
  }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [gradeClass, setGradeClass] = React.useState(Math.floor(userInfo.number / 100));
  const [timetable, setTimetable] = React.useState<TimetableResponse["data"]>(init);

  const getTimetable = async (gc: string) => {
    setLoading(true);
    try {
      const grade = gc[0];
      const _class = gc[1];
      setGradeClass(Number(gc));
      const res: AxiosResponse<TimetableResponse> = await instance.get(`/api/timetable/${grade}/${_class}`);
      setTimetable(res.data.data);
      router.refresh();
    }
    catch(e: any){
      console.error(e.response.data.message);
      setTimetable([]);
    }
    setLoading(false);
  };

  return (
    <article className="flex flex-col gap-3">
      <h1 className="text-xl font-semibold flex flex-row gap-2 items-center">
          시간표
        <select 
          value={gradeClass}
          onChange={(e) => getTimetable(e.target.value)}
          className="bg-transparent text-base font-normal"
        >
          {
            new Array(3).fill(0).map((_, i) => (
              <optgroup key={i} label={`${i + 1}학년`}>
                {
                  new Array(6).fill(0).map((_, j) => (
                    <option key={j} value={(i + 1) * 10 + j + 1}>{i + 1}학년 {j + 1}반</option>
                  ))
                }
              </optgroup>
            ))
          }
        </select>
      </h1>
      <section className={[
        "w-full rounded border border-text/10 overflow-hidden bg-white",
        loading ? "loading_background" : "",
      ].join(" ")}>
        <table className="w-full table-fixed">
          <tbody className="w-full">
            <tr>
              <th className="w-8 py-2 text-primary text-sm font-semibold border-r border-text/10">-</th>
              <th className="px-2 py-2 text-primary text-sm font-semibold">월</th>
              <th className="px-2 py-2 text-primary text-sm font-semibold">화</th>
              <th className="px-2 py-2 text-primary text-sm font-semibold">수</th>
              <th className="px-2 py-2 text-primary text-sm font-semibold">목</th>
              <th className="px-2 py-2 text-primary text-sm font-semibold">금</th>
            </tr>
            {
              timetable.length ? timetable.sort((a, b) => a[0].period - b[0].period).map((e) => {
                return (
                  <tr key={e[0].weekday} className="border-t border-text/10">
                    <td className="py-3 text-text/60 text-sm font-normal border-r border-text/10 text-center">{e[0].period}</td>
                    {
                      e.sort((a, b) => a.period - b.period).map((time, i) => (
                        <td key={i} className={[
                          "px-1 py-3 whitespace-pre-line",
                          time.changed ? "bg-text/5 dark:bg-text/10" : "",
                        ].join(" ")}>
                          <p className="text-text/60 text-sm font-normal text-center whitespace-break-spaces break-all">
                            <span className="flex flex-col gap-1 items-center justify-center">
                              <span className="text-text">{time.subject}</span>
                              <span className="text-text/60"> {time.subject && `${time.teacher}□`}</span>
                            </span>
                          </p>
                        </td>
                      ))
                    }
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-text/60 text-sm font-normal text-center border-t border-text/10">시간표가 없습니다.</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </section>
    </article>
  );
};

export default Timetable;