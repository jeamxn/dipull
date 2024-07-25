/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useSetRecoilState } from "recoil";

import Mover from "@/components/Mover";
import * as Select from "@/components/Select";
import { useAuth } from "@/hooks";
import { loadingAtom } from "@/utils/states";

import Item from "./item";
import { BambooResponse, BambooSort } from "./list/[sort]/[number]/utils";
import { sortOptions, sortOptionValues } from "./sort";
import Target from "./target";

function Home() {
  const { user, needLogin, onlyStudent } = useAuth();
  const [selected, setSelected] = React.useState<BambooSort>("recent");
  const [number, setNumber] = React.useState(0);
  const [current, setCurrent] = React.useState(1);
  const maxCurrent = React.useMemo(() => Math.ceil(number / 20), [number]);
  const router = useRouter();
  const setLoading = useSetRecoilState(loadingAtom);

  const { data, isFetching } = useQuery({
    queryKey: ["bamboo_list", selected, current],
    queryFn: async () => {
      const response = await axios.get<BambooResponse>(`/bamboo/list/${selected}/${current}`);
      setNumber(response.data.count);
      return response.data.list;
    },
    initialData: [],
  });

  return (
    <div className="py-6 flex flex-col gap-6">
      <div className="flex flex-row items-center justify-between gap-4 px-4">
        <div className="flex flex-row items-center justify-start gap-2">
          <img
            className="w-7 h-7 rounded-full border border-text/10 dark:border-text-dark/30"
            src="https://lh3.googleusercontent.com/a/ACg8ocKyDiVdNK5iuPoyj3TGnsK7daSEj3ciCDPT99KKr_qq10tUvmoC=s96-c"
            alt="profile"
          />
          <p className="text-xl font-semibold select-none transition-all whitespace-nowrap text-text dark:text-text-dark">대나무 숲</p>
          <p className="text-xl font-semibold select-none transition-all text-text dark:text-text-dark">|</p>
          <Select.Title
            label="정렬 기준 선택하기"
            optionValues={sortOptionValues}
            options={sortOptions}
            value={selected}
            onConfirm={(t) => {
              setSelected(t);
              setCurrent(1);
            }}
          />
        </div>
        <Mover
          className="-m-2 p-2"
          onClick={() => {
            if (!user.id) {
              setLoading(false);
              needLogin();
              return;
            }
            if (user.type !== "student") {
              setLoading(false);
              onlyStudent();
              return;
            }
            router.push("/bamboo/student/write");
          }}
        >
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-text dark:fill-text-dark" d="M6 22.4375C5.45 22.4375 4.97917 22.2417 4.5875 21.85C4.19583 21.4583 4 20.9875 4 20.4375V4.4375C4 3.8875 4.19583 3.41667 4.5875 3.025C4.97917 2.63333 5.45 2.4375 6 2.4375H13.175C13.4417 2.4375 13.6958 2.4875 13.9375 2.5875C14.1792 2.6875 14.3917 2.82917 14.575 3.0125L19.425 7.8625C19.6083 8.04583 19.75 8.25833 19.85 8.5C19.95 8.74167 20 8.99583 20 9.2625V12.4375H18V9.4375H14C13.7167 9.4375 13.4792 9.34167 13.2875 9.15C13.0958 8.95833 13 8.72083 13 8.4375V4.4375H6V20.4375H12V22.4375H6ZM18.3 14.9625L19.375 16.0375L15.5 19.8875V20.9375H16.55L20.425 17.0875L21.475 18.1375L17.475 22.1375C17.375 22.2375 17.2625 22.3125 17.1375 22.3625C17.0125 22.4125 16.8833 22.4375 16.75 22.4375H14.5C14.3667 22.4375 14.25 22.3875 14.15 22.2875C14.05 22.1875 14 22.0708 14 21.9375V19.6875C14 19.5542 14.025 19.425 14.075 19.3C14.125 19.175 14.2 19.0625 14.3 18.9625L18.3 14.9625ZM21.475 18.1375L18.3 14.9625L19.75 13.5125C19.9333 13.3292 20.1667 13.2375 20.45 13.2375C20.7333 13.2375 20.9667 13.3292 21.15 13.5125L22.925 15.2875C23.1083 15.4708 23.2 15.7042 23.2 15.9875C23.2 16.2708 23.1083 16.5042 22.925 16.6875L21.475 18.1375Z" />
          </svg>
        </Mover>
      </div>

      <div className="flex flex-col gap-3 px-4">
        {
          !data || isFetching ? (
            <>
              <div className="w-full border-b border-text/10 dark:border-text-dark/20" />
              <div className="w-full h-20 flex flex-row items-center justify-center">
                <p className="text-lg font-semibold text-text/40 dark:text-text-dark/50">대나무를 찾는 중...</p>
              </div>
            </>
          ) : data.length ? data.map((_, index) => (
            <Item
              key={index}
              href={`/bamboo/student/${_.id}`}
              title={_.title}
              name={_.user}
              time={_.timestamp}
              like={_.goods}
              dislike={_.bads}
              comment={_.comments}
            />
          )) : (
            <>
              <div className="w-full border-b border-text/10 dark:border-text-dark/20" />
              <div className="w-full h-20 flex flex-row items-center justify-center">
                <p className="text-lg font-semibold text-text dark:text-text-dark">해당 정렬 기준의 대나무가 없습니다.</p>
              </div>
            </>
          )
        }
        <div className="w-full border-b border-text/10 dark:border-text-dark/20" />
      </div>
      
      <Target
        current={current}
        setCurrent={setCurrent}
        maxCurrent={maxCurrent}
      />
    </div>
  );
}

export default Home;