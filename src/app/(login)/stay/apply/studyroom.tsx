import React from "react";

import { BySeatsObj, StudyroomData } from "@/app/api/stay/utils";
import { UserData } from "@/app/auth/type";

const Studyroom = ({
  loading,
  selectedSeat,
  setSelectedSeat,
  mySelect,
  bySeatsObj,
  studyroom,
  userInfo,
  disabled,
  allowSelect,
  classStay,
}: {
  loading: boolean;
  selectedSeat: string;
  setSelectedSeat: React.Dispatch<React.SetStateAction<string>>;
  mySelect: string;
  bySeatsObj: BySeatsObj;
  studyroom: StudyroomData[];
  userInfo: UserData;
  disabled?: boolean;
  allowSelect?: boolean;
  classStay: {
    1: boolean;
    2: boolean;
    3: boolean;
  };
}) => {
  const classStayArr = Object.keys(classStay).filter(e => classStay[e as unknown as 1 | 2 | 3]);
  return (
    <>
      <table className={[
        "overflow-auto flex flex-col gap-1 py-1 rounded",
        loading ? "loading_background border border-text/10" : "bg-transparent"
      ].join(" ")}>
        <tbody className="overflow-auto flex flex-col gap-1 items-start rounded">
          {
            new Array(15).fill(0).map((_, i) => i === 0 ? (
              <tr key={i} className="flex flex-row gap-1">
                <td className="w-5 h-5 flex justify-center items-center">
                  <p className="text-center text-sm font-normal">{String.fromCharCode(i + 64)}</p>
                </td>
                {
                  new Array(18).fill(0).map((_, j) => (
                    <td key={j} className="w-10 h-5 flex justify-center items-center">
                      <p className="text-center text-sm font-normal">{j + 1}</p>
                    </td>
                  ))
                }
              </tr>
            ) : (
              <tr key={i} className="flex flex-row gap-1">
                <td className="w-5 h-10 flex justify-center items-center">
                  <p className="text-center text-sm font-normal">{String.fromCharCode(i + 64)}</p>
                </td>
                {
                  new Array(18).fill(0).map((_, j) => {
                    const key = `${String.fromCharCode(i + 64)}${j + 1}`;
                    const owner = bySeatsObj[String.fromCharCode(i + 64)]?.[j + 1];
                    const type = studyroom.find(e => 
                      e.seat[String.fromCharCode(i + 64)]?.includes(j + 1)
                    );
                    const disabled_base = (disabled || owner || mySelect || type?.gender !== userInfo.gender || !type.grade.includes(Math.floor(userInfo.number / 1000)));
                    const noColor = !type?.color;
                    const disabled_in = (!allowSelect && disabled_base) || noColor;
                    return (
                      <td 
                        key={j} 
                        className={[
                          "w-10 h-10 rounded-sm flex justify-center items-center select-none transition-colors",
                          selectedSeat === key ? "bg-primary text-white" : "",
                          disabled_in ? "" : "cursor-pointer"
                        ].join(" ")}
                        style={{
                          backgroundColor: !(selectedSeat === key) && type?.color || ""
                        }}
                        onClick={() => {
                          if(disabled_in) return;
                          if(key === selectedSeat) setSelectedSeat("@0");
                          else setSelectedSeat(key);
                        }}
                      >
                        <p className={[
                          "text-center text-xs transition-colors font-medium",
                          selectedSeat === key ? "text-white" : ""
                        ].join(" ")}>
                          {!noColor ? (owner || key) : ""}
                        </p>
                      </td>
                    );
                  })
                }
              </tr>
            ))
          }
        </tbody>
      </table>
      <article className={[
        "w-full border border-text/10 rounded bg-white p-5 flex flex-row justify-around gap-4 flex-wrap",
        loading ? "loading_background" : "",
      ].join(" ")}>
        {
          studyroom.map((e, i) => {
            const newGrade = e.grade.filter(e => {
              return !classStay[e as 1 | 2 | 3];
            });
            return e.color !== "rgb(var(--color-text) / .1)" && newGrade.length ? (
              <figure key={i} className="flex flex-row gap-2 items-center">
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: e.color }} />
                <p className="text-base">{newGrade.join(", ")}학년 {e.gender === "male" ? "남" : "여"}학생</p>
              </figure>
            ) : null;
          })
        }
        {
          classStayArr.length ? (
            <figure className="flex flex-row gap-2 items-center">
              <div className="w-4 h-4 rounded-sm bg-[#7dbcff]" />
              <p className="text-base">{classStayArr.join(", ")}학년 교실</p>
            </figure>
          ) : null
        }
      </article>
    </>
  );
};

export default Studyroom;