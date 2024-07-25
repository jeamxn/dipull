"use client";

import React from "react";

import { useAuth } from "@/hooks";

type Outing = {
  saturday: string[];
  sunday: string[];
};

const Stay = () => {
  const { user, needLogin, onlyStudent } = useAuth();

  const [outing, setOuting] = React.useState<Outing>({
    saturday: ["자기계발외출 (10:20~14:00)","자123기계발외출 (10:20~14:00)"],
    sunday: ["자기계발외출 (10:20~14:00)","자123기계발외출 (10:20~14:00)"],
  });
  const [reason, setReason] = React.useState("");

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-4 w-full">
        <p className="px-4 text-xl font-semibold transition-all whitespace-nowrap text-text dark:text-text-dark">좌석 선택</p>
      
        <div className="flex flex-row items-center justify-between px-4 gap-2">
          <div className="flex flex-col gap-1">
            <p className="text-base font-normal transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">내가 선택한 좌석</p>
            <p className="text-xl font-semibold transition-all whitespace-nowrap text-text dark:text-text-dark">미선택</p>
          </div>
          <button className="bg-text dark:bg-text-dark px-6 py-3 rounded-xl">
            <p className="text-white dark:text-white-dark">선택하기</p>
          </button>
        </div>

        <div className="flex flex-col gap-2 px-4">
          <p className="text-base font-normal transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">좌석 미선택 사유</p>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-3 border border-text/20 dark:border-text-dark/30 rounded-xl bg-transparent outline-none text-text dark:text-text-dark"
            placeholder="좌석 미선택 사유를 입력해주세요."
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-4 px-4 w-full overflow-hidden">
        <p className="text-xl font-semibold transition-all whitespace-nowrap text-text dark:text-text-dark">외출 신청</p>
        <div className="flex flex-row items-start justify-between gap-4 w-full flex-wrap">
          <div className="flex flex-col gap-4">
            {
              Object.entries(outing).map(([day, outs]) => (
                <div key={day} className="flex flex-col items-start justify-start gap-1">
                  <p className="text-base font-normal transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">
                    {day === "saturday" ? "토요일" : "일요일"}
                  </p>
                  <div className="flex flex-col items-start justify-start gap-0">
                    {
                      outs.length ? outs.map((out) => (
                        <button
                          key={out}
                          onClick={(e) => {
                            const deleted = outing[day as keyof Outing].filter((o) => o !== out);
                            setOuting({
                              ...outing,
                              [day]: deleted,
                            });
                          }}
                        >
                          <p className="text-lg font-medium transition-all whitespace-nowrap text-text dark:text-text-dark">
                            {out}
                          </p>
                        </button>
                      )) : (
                        <p className="text-lg font-medium transition-all whitespace-nowrap text-text dark:text-text-dark">
                          없음
                        </p>
                      )
                    }
                  </div>
                </div>
              ))
            }
          </div>
          <div>
            <button className="bg-text dark:bg-text-dark px-6 py-3 rounded-xl">
              <p className="text-white dark:text-white-dark">추가하기</p>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-4">
        <button
          className={[
            "p-3 bg-text dark:bg-text-dark text-white dark:text-white-dark rounded-xl font-semibold w-full transition-all",
          // true ? "cursor-pointer" : "cursor-not-allowed opacity-50",
          ].join(" ")}
          // disabled={!machine || !time}
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