import React from "react";

import { BySeatsObj, StudyroomData } from "@/app/api/stay/utils";
import { UserData } from "@/app/auth/type";

const Studyroom = ({
  loading,
  selectedSeat,
  setSelectedSeat,
  selectedSeats,
  setSelectedSeats,
  mySelect,
  bySeatsObj,
  studyroom,
  setStudyroom,
  userInfo,
  disabled,
  allowSelect,
  classStay,
  showStatics = true,
  showAllTypes = false,
  verticalStatic = false,
  canSelectStatic = false,
  children,
  selectedStatic,
  setSelectedStatic,
}: {
  loading: boolean;
  selectedSeat?: string;
  setSelectedSeat?: React.Dispatch<React.SetStateAction<string>>;
  selectedSeats?: string[];
  setSelectedSeats?: React.Dispatch<React.SetStateAction<string[]>>;
  mySelect: string;
  bySeatsObj: BySeatsObj;
  studyroom: StudyroomData[];
  setStudyroom?: React.Dispatch<React.SetStateAction<StudyroomData[]>>;
  userInfo: UserData;
  disabled?: boolean;
  allowSelect?: boolean;
  showAllTypes?: boolean;
  showStatics?: boolean;
  verticalStatic?: boolean;
  canSelectStatic?: boolean;
  children?: React.ReactNode;
  classStay: {
    1: boolean;
    2: boolean;
    3: boolean;
  };
  selectedStatic?: StudyroomData;
  setSelectedStatic?: React.Dispatch<React.SetStateAction<StudyroomData | undefined>>;
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

                    const types = studyroom.filter(e =>
                      e.seat[String.fromCharCode(i + 64)]?.includes(j + 1)
                      &&
                      !classStayArr.includes(String(e.grade))
                    );
                    const isCannotSelect = types.some(e => e.grade === 0 && !e.color);
                    const isRightGender = types.some(e => e.gender === userInfo.gender);
                    const isRightGrade = types.some(e => e.grade === Math.floor(userInfo.number / 1000));
                    const isNoColor = types.every(e => !e.color);
                    const mapedColor = types.map(e => e.color).filter(e => e);
                    const madeColorGradient = mapedColor.map((e, i) => `${e} ${
                      i === 0 ? "0%" : `${(100 / types.length) * i}%`
                    } ${(100 / mapedColor.length) * (i + 1)}%`);
                    // const madeColorGradient = types.map(e => e.color).filter(e => e);
                    const gradient = madeColorGradient.length > 1 ? `linear-gradient(-45deg, ${madeColorGradient.join(", ")})` : madeColorGradient[0];
                    const disabled_base = (disabled || owner || mySelect || !isRightGender || !isRightGrade);
                    const disabled_in = ((!allowSelect && disabled_base) || isNoColor) && !showAllTypes;

                    return (
                      <td 
                        key={j} 
                        className={[
                          "w-10 h-10 rounded-sm flex justify-center items-center select-none transition-all",
                          disabled_in ? "" : "cursor-pointer"
                        ].join(" ")}
                        onClick={() => {
                          if (disabled_in) return;
                          if (!showAllTypes && isCannotSelect) return;
                          if (setSelectedSeat && selectedSeat) {
                            if(key === selectedSeat) setSelectedSeat("@0");
                            else setSelectedSeat(key);
                          }
                          if (setSelectedSeats && selectedSeats) {
                            if (selectedSeats?.includes(key)) setSelectedSeats(selectedSeats.filter(e => e !== key));
                            else setSelectedSeats([...selectedSeats, key]);
                          }
                        }}
                      >
                        <div
                          className={[
                            "w-10 h-10 flex flex-row items-center justify-center rounded-sm transition-all",
                            (
                              selectedSeat === key
                              ||
                              (selectedSeats && selectedSeats.includes(key))
                            ) ? "border-text border-[3px]" : "",
                          ].join(" ")}
                          style={{
                            background: !isNoColor || showAllTypes ? gradient || "rgb(var(--color-text) / .25)" : "",
                          }}
                        >
                          <p
                            className={[
                              "text-center text-xs transition-all font-medium",
                            // selectedSeat === key ? "text-white" : ""
                            ].join(" ")}
                          >
                            {!isNoColor || showAllTypes ? (owner || key) : ""}
                          </p>
                        </div>
                      </td>
                    );
                  })
                }
              </tr>
            ))
          }
        </tbody>
      </table>
      {
        selectedSeats ? (
          <article className={[
            "flex flex-col gap-5 bg-white rounded border border-text/10 p-5 overflow-auto w-full select-none",
          ].join(" ")}>
            <div className="flex flex-col gap-2 w-full">
              <h1 className="text-xl font-semibold">선택한 좌석 목록</h1>
              <div className="flex flex-row flex-wrap gap-2">
                {
                  selectedSeats.length ? selectedSeats.map((e, i) => (
                    <div
                      key={i}
                      className="text-center text-text py-2 bg-text/10 border border-text/20 w-20 rounded hover:border-text/60 cursor-pointer"
                      onClick={() => {
                        if (setSelectedSeats) setSelectedSeats(selectedSeats.filter(seat => seat !== e));
                      }}
                    >
                      {e}
                    </div>
                  )) : (
                    <p className="text-center text-text/50">선택된 좌석이 없습니다.</p>
                  )
                }
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row gap-2 items-center justify-center">
                {
                  selectedStatic ? (
                    <>
                      <button
                        className="w-full py-2 rounded-sm border"
                        onClick={() => {
                          if (selectedSeats && setSelectedSeats && setStudyroom && setSelectedStatic) {
                            const copy = structuredClone(selectedStatic);
                            for (const seat of selectedSeats) {
                              const key = String(seat[0]);
                              const value = Number(seat.slice(1));

                              if (copy.seat[key] && copy.seat[key].includes(value)) { 
                                continue;
                              }
                              else if (copy.seat[key]) {
                                copy.seat[key].push(value);
                              }
                              else {
                                copy.seat[key] = [value];
                              }
                            }
                            setStudyroom(prev => {
                              const index = prev.findIndex(e => e.color === copy.color);
                              if (index === -1) {
                                return [...prev, copy];
                              } else {
                                const newStudyroom = [...prev];
                                newStudyroom[index] = copy;
                                return newStudyroom;
                              }
                            });
                            setSelectedStatic(copy);
                          }
                        }}
                        style={{
                          borderColor: selectedStatic.color,
                          color: selectedStatic.color,
                        }}
                      >
                        {
                          selectedStatic.grade === 0 ? "선택 불가 자리" : `${selectedStatic.grade}학년 ${selectedStatic.gender === "male" ? "남" : "여"}학생`
                        }에 추가
                      </button>
                      <button
                        className="w-full py-2 rounded-sm border border-[#EF4444] text-[#EF4444]"
                        onClick={() => {
                          if (selectedSeats && setSelectedSeats && setStudyroom && setSelectedStatic) {
                            const copy = structuredClone(selectedStatic);
                            for (const seat of selectedSeats) {
                              const key = String(seat[0]);
                              const value = Number(seat.slice(1));
                          
                              if (copy.seat[key].includes(value)) {
                                copy.seat[key] = copy.seat[key].filter(e => e !== value);
                              }
                            }
                            setStudyroom(prev => {
                              const index = prev.findIndex(e => e.color === copy.color);
                              if (index === -1) {
                                return [...prev, copy];
                              } else {
                                const newStudyroom = [...prev];
                                newStudyroom[index] = copy;
                                return newStudyroom;
                              }
                            });
                            setSelectedStatic(copy);
                          }
                        }}
                      >
                        {
                          selectedStatic.grade === 0 ? "선택 불가 자리" : `${selectedStatic.grade}학년 ${selectedStatic.gender === "male" ? "남" : "여"}학생`
                        }에서 삭제
                      </button>
                    </>
                  ) : (
                    <p className="text-center text-text/50">구분을 선택해주세요.</p>
                  )
                }
              </div>
              <button
                className="w-full py-2 border border-text text-text rounded-sm"
                onClick={() => {
                  if (setSelectedSeats) setSelectedSeats([]);
                }}
              >
                전체 좌석 선택 해제
              </button>
            </div>
            
          </article>
        ) : null
      }
      {
        showStatics ? (
          <div className="w-full flex flex-row gap-2">
            <article className={[
              "border border-text/10 rounded flex bg-white flex-wrap",
              canSelectStatic ? "gap-2" : "gap-4",
              verticalStatic ? "flex-col p-4" : "flex-row justify-around p-5",
              loading ? "loading_background" : "",
              setSelectedStatic ? "w-60" : "w-full",
            ].join(" ")}>
              {
                studyroom.filter(
                  e => !classStayArr.includes(String(e.grade))
                ).sort(
                  (a, b) => a.grade - b.grade
                ).map((e, i) => {
                  const newGrade = e.grade;
                  const rt = (
                    <figure
                      key={i}
                      className={[
                        "flex flex-row items-center duration-200 gap-2",
                        canSelectStatic ? "cursor-pointer hover:bg-text/10 py-2 px-4 select-none rounded" : "",
                        selectedStatic === e ? "bg-text/20" : ""
                      ].join(" ")}
                      onClick={() => {
                        if (!canSelectStatic || !setSelectedStatic) return;
                        if (selectedStatic === e) setSelectedStatic(undefined);
                        else setSelectedStatic(e);
                      }}
                    >
                      <div
                        className={[
                          "w-4 h-4 rounded-sm",
                          e.grade === 0 ? "bg-text/30" : ""
                        ].join(" ")}
                        style={{
                          backgroundColor: e.color,
                        }} />
                      <p className="text-base whitespace-nowrap">
                        {
                          e.grade === 0 ? "선택 불가 자리" : `${newGrade}학년 ${e.gender === "male" ? "남" : "여"}학생`
                        }
                      </p>
                    </figure>
                  );
    
                  if (showAllTypes) return rt;
                  else if (newGrade !== 1 && newGrade !== 2 && newGrade !== 3) return null;
                  else if (classStay[newGrade]) return null;
                  else if (e.color === "rgb(var(--color-text) / .1)") return null;
                  return rt;
                })
              }
              {
                classStayArr.length ? (
                  <figure className={[
                    "flex flex-row items-center duration-200 gap-2",
                    canSelectStatic ? "cursor-pointer hover:bg-text/10 py-2 px-4" : "",
                  ].join(" ")}>
                    <div className="w-4 h-4 rounded-sm bg-[#7dbcff]" />
                    <p className="text-base whitespace-nowrap">{classStayArr}학년 교실</p>
                  </figure>
                ) : null
              }
            </article>
            {children}
          </div>
        ) : null
      }
    </>
  );
};

export default Studyroom;