import * as jose from "jose";
import React from "react";

import { TokenInfo } from "@/app/auth/type";
import instance from "@/utils/instance";

const Timetable = () => {
  const [gradeClass, setGradeClass] = React.useState(0);

  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")!;
    const decrypt = jose.decodeJwt(accessToken) as TokenInfo;
    setGradeClass(Math.floor(decrypt.data.number / 100));
  }, []);

  const getTimetable = async () => {
    const res = await instance.get(`/api/timetable/${Math.floor(gradeClass / 10)}/${gradeClass % 10}`);
    console.log(res.data);
  };

  React.useEffect(() => {
    if(gradeClass === 0) return;
    getTimetable();
  }, [gradeClass]);

  return (
    <article>
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
      <table>
        
      </table>
    </article>
  );
};

export default Timetable;