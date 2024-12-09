"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React from "react";

import { useCalenderModalDispatch } from "@/components/CalenderModal";
import type { Meal as MealType } from "@/utils/db/utils";

import { MealResponse } from "./[date]/get";

const Meal = () => {
  const calenderDispatch = useCalenderModalDispatch();
  const [date, setDate] = React.useState(moment());
  const [show, setShow] = React.useState<boolean>(false);

  const { data, isFetching } = useQuery({
    queryKey: ["meal", date.format("YYYY-MM-DD")],
    queryFn: async () => {
      const response = await axios.get<MealResponse>(`/meal/${date.format("YYYY-MM-DD")}`);
      return response.data.data;
    }
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="px-4 flex flex-row items-center justify-start gap-1">
        <p className="text-xl font-semibold text-text dark:text-text-dark">급식</p>
        <p className="text-xl font-semibold text-text dark:text-text-dark">·</p>
        <button
          className="cursor-pointer flex flex-row items-center justify-start"
          onClick={() => {
            setShow(true);
            calenderDispatch({
              type: "show",
              data: {
                value: date,
                onConfirm: (date) => { 
                  setDate(date);
                  setShow(false);
                },
                onCancle: () => { 
                  setShow(false);
                }
              }
            });
          }}
        >
          <p className="text-xl font-semibold select-none text-text dark:text-text-dark">{date.format("YYYY년 M월 D일")}</p>
          <div
            className={[
              "transition-transform",
              show ? "rotate-180" : "",
            ].join(" ")}
          >
            <svg className="w-6 h-6 fill-text dark:fill-text-dark" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="fill-inherit" d="M11.3 14.7375L8.69998 12.1375C8.38331 11.8208 8.31248 11.4583 8.48748 11.05C8.66248 10.6417 8.97498 10.4375 9.42498 10.4375H14.575C15.025 10.4375 15.3375 10.6417 15.5125 11.05C15.6875 11.4583 15.6166 11.8208 15.3 12.1375L12.7 14.7375C12.6 14.8375 12.4916 14.9125 12.375 14.9625C12.2583 15.0125 12.1333 15.0375 12 15.0375C11.8666 15.0375 11.7416 15.0125 11.625 14.9625C11.5083 14.9125 11.4 14.8375 11.3 14.7375Z" />
            </svg>
          </div>
        </button>
      </div>
      <div className="px-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory block">
        <div className="flex flex-row gap-2 w-max h-full">
          {
            (["breakfast", "lunch", "dinner"] as (keyof MealType["data"])[]).map((type, i) => (
              <div key={i} className="h-unset snap-center">
                <div
                  className={[
                    "h-full rounded-2xl p-6 bg-white dark:bg-text-dark/15 flex flex-col items-start justify-start gap-2 min-w-64",
                  ].join(" ")}
                >
                  <p className="text-xl font-bold text-text dark:text-text-dark">
                    {
                      type === "breakfast" ? "아침" : type === "lunch" ? "점심" : "저녁"
                    }
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {
                      data?.[type].map((e, i) => (
                        <div key={i} className="flex flex-row gap-1 opacity-80">
                          <p className="text-text dark:text-text-dark">{e}</p>
                        </div>
                      ))
                    }
                    {
                      isFetching ? (
                        <div className="flex flex-row gap-1 opacity-80">
                          <p className="text-text dark:text-text-dark">급식 데이터를 찾는 중...</p>
                        </div>
                      ) : (
                        !data?.[type].length && (
                          <div className="flex flex-row gap-1 opacity-80">
                            <p className="text-text dark:text-text-dark">급식 정보가 없습니다.</p>
                          </div>
                        )
                      )
                    }
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Meal;