"use client";

import React from "react";

import { useAuth } from "@/hooks";

const Stay = () => {
  const { user, needLogin, onlyStudent } = useAuth();
  const [reason, setReason] = React.useState("");

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
              "w-full px-4 py-3 border border-text/20 dark:border-text-dark/30 rounded-xl outline-none text-text dark:text-text-dark bg-transparent",
            ].join(" ")}
            placeholder="금요귀가 사유를 입력해주세요."
          />
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