"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

import Card from "../card";

import { WakeupListResponse } from "./get/utlis";

const Machine = () => {
  const { data } = useQuery({
    queryKey: ["wakeup_apply_list"],
    queryFn: async () => {
      const response = await axios.get<WakeupListResponse>("/wakeup/list/get");
      return response.data.data;
    },
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      {
        data ? data.length ? data.map((video, index) => (
          <Card
            key={index}
            id={video._id}
            vote={video.count}
            rank={index + 1}
            title={video.title}
          />
        )) : (
          <div className="w-full px-6 flex flex-row items-center justify-center">
            <p className="text-text/40 dark:text-text-dark/50 text-center">신청된 기상송이 없습니다.</p>
          </div>
        ) : (
          <div className="w-full px-6 flex flex-row items-center justify-center">
            <p className="text-text/40 dark:text-text-dark/50 text-center">로딩 중 입니다...</p>
          </div>
        )
      }
    </div>
  );
};

export default Machine;