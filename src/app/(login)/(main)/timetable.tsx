import { AxiosResponse } from "axios";
import * as jose from "jose";
import React from "react";

import { TimetableResponse } from "@/app/api/timetable/[grade]/[class]/route";
import { TokenInfo } from "@/app/auth/type";
import instance from "@/utils/instance";

const Timetable = ({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [gradeClass, setGradeClass] = React.useState(0);
  const [timetable, setTimetable] = React.useState<TimetableResponse["data"]>({});

  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")!;
    const decrypt = jose.decodeJwt(accessToken) as TokenInfo;
    setGradeClass(Math.floor(decrypt.data.number / 100));
  }, []);

  const getTimetable = async () => {
    setLoading(true);
    try{
      const res: AxiosResponse<TimetableResponse> = await instance.get(`/api/timetable/${Math.floor(gradeClass / 10)}/${gradeClass % 10}`);
      setTimetable(res.data.data);
    }
    catch(e: any){
      console.error(e.response.data.message);
    }
    setLoading(false);
  };
  
  React.useEffect(() => {
    if(gradeClass === 0) return;
    getTimetable();
  }, [gradeClass]);

  return (
    <article className="flex flex-col gap-3">
      <h1 className="text-xl font-semibold flex flex-row gap-2 items-center">
          시간표
        <select 
          value={gradeClass}
          onChange={(e) => setGradeClass(Number(e.target.value))}
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
              Object.keys(timetable).length ? Object.keys(timetable).map((period, index) => (
                <tr 
                  key={index}
                  className={[
                    Number(period) % 2 === 1 ? "bg-text/[.035]" : "",
                  ].join(" ")}
                >
                  <td className="py-3 text-text/60 text-sm font-normal border-r border-text/10 text-center">{period}</td>
                  {
                    ["월", "화", "수", "목", "금"].map((day, i) => (
                      <td key={i} className="px-1 py-3 whitespace-pre-line">
                        <p className="text-text/60 text-sm font-normal text-center whitespace-break-spaces break-all">{timetable[Number(period)][day as "월" | "화" | "수" | "목" | "금"]}</p>
                      </td>
                    ))
                  }
                </tr>
              )) : (
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