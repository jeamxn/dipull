"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React from "react";

import { useAuth } from "@/hooks";

import Card from "../card";

import { MyWakeupResponseString } from "./grant/list/utils";

const WakeupMy = () => {
  const { user, login } = useAuth();
  const { data: myList, refetch: refetchMyList, isFetching } = useQuery({
    queryKey: ["wakeup_my_list"],
    queryFn: async () => {
      const response = await axios.post<MyWakeupResponseString>("/wakeup/my/grant/list");
      return response.data.data;
    },
    enabled: Boolean(user.id),
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      {
        user.id ? 
          !myList ? (
            <div className="w-full px-4 flex flex-row items-center justify-center">
              <p className="text-text/40 dark:text-text-dark/50 text-center">내 신청 목록을 불러오는 중...</p>
            </div>
          ) : myList.length ? myList.map((video, index) => (
            <Card
              key={index}
              _id={video._id}
              id={video.video}
              title={video.title}
              type="remove"
              parentRefetch={refetchMyList}
              myList={myList}
              isMyList
            />
          )) : (
            <div className="w-full px-4 flex flex-row items-center justify-center">
              <p className="text-text/40 dark:text-text-dark/50 text-center">신청한 기상송이 없습니다.</p>
            </div>
          )  : (
            <div className="w-full px-4 flex flex-col items-center justify-center gap-1">
              <p className="text-text/40 dark:text-text-dark/50 text-center">이 페이지는 로그인 후 이용할 수 있어요.</p>
              <button onClick={login} className="-m-3 p-3">
                <p className="text-text/40 dark:text-text-dark/50 text-center underline">로그인하기</p>
              </button>
            </div>
          )
      }
    </div>
  );
};

export default WakeupMy;