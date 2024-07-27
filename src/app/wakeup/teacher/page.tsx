"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

import { useAlertModalDispatch } from "@/components/AlertModal";
import { useAuth } from "@/hooks";

import Card from "../card";
import { WakeupListData, WakeupListResponse } from "../list/get/utlis";
import { MyWakeupResponseString } from "../my/grant/list/utils";

import { WakeupDeleteResponse } from "./[id]/delete/utils";

const Machine = () => {
  const { user, login } = useAuth();

  const [delete_id, setDelete_id] = React.useState<WakeupListData | null>(null);
  const alertDispatch = useAlertModalDispatch();

  const { data, refetch } = useQuery({
    queryKey: ["wakeup_apply_list"],
    queryFn: async () => {
      const response = await axios.get<WakeupListResponse>("/wakeup/list/get");
      return response.data.data;
    },
  });
  const { refetch: deleteWakeup, isError } = useQuery({
    queryKey: ["wakeup_delete", delete_id?._id],
    queryFn: async () => {
      const response = await axios.delete<WakeupDeleteResponse>(`/wakeup/teacher/${delete_id?._id}/delete`);
      setDelete_id(null);
      alertDispatch({
        type: "show",
        data: {
          title: "기상송 삭제 완료!",
          description: `기상송이 삭제되었습니다.\n삭제된 기상송: ${delete_id?.title}`,
        }
      });
      refetch();
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(delete_id?._id),
    retry: false,
  });

  return (
    <div className="flex flex-col gap-5 w-full">
      {
        data ? data.length ? data.map((video, index) => (
          <div
            key={index}
            className="w-full flex flex-col items-end justify-center gap-1"
          >
            <Card
              id={video._id}
              vote={video.count}
              rank={index + 1}
              title={video.title}
              myList={[]}
              parentRefetch={() => {
                refetch();
              }}
              disabled
            />
            <div className="px-4 opacity-50 flex flex-row gap-1.5">
              <button
                onClick={() => {
                  window.open(`https://youtu.be/${video._id}`, "_blank");
                }}
              >
                <p className="underline text-text dark:text-text-dark">바로가기</p>
              </button>
              <button
                onClick={() => {
                  setDelete_id(video);
                }}
              >
                <p className="underline text-text dark:text-text-dark">삭제하기</p>
              </button>
            </div>
          </div>
        )) : (
          <div className="w-full px-4 flex flex-row items-center justify-center">
            <p className="text-text/40 dark:text-text-dark/50 text-center">신청된 기상송이 없습니다.</p>
          </div>
        ) : (
          <div className="w-full px-4 flex flex-row items-center justify-center">
            <p className="text-text/40 dark:text-text-dark/50 text-center">기상속 목록을 불러오는 중...</p>
          </div>
        )
      }
    </div>
  );
};

export default Machine;