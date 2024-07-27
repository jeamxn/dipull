"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React from "react";

import { useAuth } from "@/hooks";

import Card from "../card";
import { MyWakeupResponseString } from "../my/grant/list/utils";

import { WakeupListResponse } from "./get/utlis";

const WakeupList = () => {
  const { user, login } = useAuth();
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["wakeup_apply_list"],
    queryFn: async () => {
      const response = await axios.post<WakeupListResponse>("/wakeup/list/get");
      return response.data.data;
    },
    staleTime: 0,
  });
  const { data: myList, refetch: refetchMyList } = useQuery({
    queryKey: ["wakeup_my_list"],
    queryFn: async () => {
      const response = await axios.post<MyWakeupResponseString>("/wakeup/my/grant/list");
      return response.data.data;
    },
    enabled: Boolean(user.id),
    staleTime: 0,
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      {
        !data ? (
          <div className="w-full px-4 flex flex-row items-center justify-center">
            <p className="text-text/40 dark:text-text-dark/50 text-center">기상속 목록을 불러오는 중...</p>
          </div>
        ) : data.length ? data.map((video, index) => (
          <Card
            key={index}
            id={video._id}
            vote={video.count}
            rank={index + 1}
            title={video.title}
            myList={myList}
            parentRefetch={() => {
              refetch();
              refetchMyList();
            }}
          />
        )) : (
          <div className="w-full px-4 flex flex-row items-center justify-center">
            <p className="text-text/40 dark:text-text-dark/50 text-center">신청된 기상송이 없습니다.</p>
          </div>
        )
      }
    </div>
  );
};

export default WakeupList;