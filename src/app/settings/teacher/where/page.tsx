"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

import { useAlertModalDispatch } from "@/components/AlertModal";
import { useConfirmModalDispatch } from "@/components/ConfirmModal";

import { ToEditResponse } from "./edit/utils";

const Settings = () => {
  const confirmModalDispatch = useConfirmModalDispatch();
  const alertDispatch = useAlertModalDispatch();
  const [grade, setGrade] = React.useState<number | null>(null);
  const onClick = (grade: number) => { 
    confirmModalDispatch({
      type: "show",
      data: {
        title: "특정 학년 교실로 보내기",
        description: `${grade}학년을 교실로 보내시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
        onConfirm: () => {
          setGrade(grade);
        }
      }
    });
  };

  const { isFetching: isFetchingPut } = useQuery({
    queryKey: ["edit_grade_to_class", grade],
    queryFn: async () => {
      const response = await axios.post<ToEditResponse>("/settings/teacher/where/edit", {
        grade
      });
      alertDispatch({
        type: "show",
        data: {
          title: "수정 성공!",
          description: `${grade}학년을 교실로 보냈습니다.`,
        }
      });
      setGrade(null);
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(grade !== null),
  });
  
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-4 w-full px-4">
        <p className="text-xl font-semibold transition-all whitespace-nowrap text-text dark:text-text-dark">특정 학년 교실로 보내기</p>
        <div className="flex flex-row gap-2">
          {
            [1, 2, 3].map((g) => (
              <button
                key={g}
                className={[
                  "w-full py-3 text-center text-white dark:text-white-dark bg-text dark:bg-text-dark rounded-xl",
                  isFetchingPut ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                ].join(" ")}
                onClick={() => onClick(g)}
              >
                { g === grade && isFetchingPut ? "수정 중..." : `${g}학년` }
              </button>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Settings;