/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";

import Linker from "@/components/Linker";
import Select from "@/components/Select";

import Item from "./item";

function Home() {
  const [selected, setSelected] = React.useState<string>("3학년 최재민");
  return (
    <div className="py-6 flex flex-col gap-8">
      <div className="flex flex-row items-center justify-between gap-4 px-6">
        <div className="flex flex-row items-center justify-start gap-2">
          <img
            className="w-7 h-7 rounded-full border border-text/10 dark:border-text/20"
            src="https://lh3.googleusercontent.com/a/ACg8ocKyDiVdNK5iuPoyj3TGnsK7daSEj3ciCDPT99KKr_qq10tUvmoC=s96-c"
            alt="profile"
          />
          <p className="text-xl font-semibold select-none transition-all">대나무 숲</p>
          <p className="text-xl font-semibold select-none transition-all">|</p>
          <Select
            options={[
              "최신순",
              "하루 인기순",
              "한 달 인기순",
            ]}
            value={selected}
            setValue={setSelected}
          />
        </div>
        <Linker href="/bamboo/write" className="-m-2 p-2">
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_301_152" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="25">
              <rect y="0.4375" width="24" height="24" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_301_152)">
              <path className="fill-text" d="M6 22.4375C5.45 22.4375 4.97917 22.2417 4.5875 21.85C4.19583 21.4583 4 20.9875 4 20.4375V4.4375C4 3.8875 4.19583 3.41667 4.5875 3.025C4.97917 2.63333 5.45 2.4375 6 2.4375H13.175C13.4417 2.4375 13.6958 2.4875 13.9375 2.5875C14.1792 2.6875 14.3917 2.82917 14.575 3.0125L19.425 7.8625C19.6083 8.04583 19.75 8.25833 19.85 8.5C19.95 8.74167 20 8.99583 20 9.2625V12.4375H18V9.4375H14C13.7167 9.4375 13.4792 9.34167 13.2875 9.15C13.0958 8.95833 13 8.72083 13 8.4375V4.4375H6V20.4375H12V22.4375H6ZM18.3 14.9625L19.375 16.0375L15.5 19.8875V20.9375H16.55L20.425 17.0875L21.475 18.1375L17.475 22.1375C17.375 22.2375 17.2625 22.3125 17.1375 22.3625C17.0125 22.4125 16.8833 22.4375 16.75 22.4375H14.5C14.3667 22.4375 14.25 22.3875 14.15 22.2875C14.05 22.1875 14 22.0708 14 21.9375V19.6875C14 19.5542 14.025 19.425 14.075 19.3C14.125 19.175 14.2 19.0625 14.3 18.9625L18.3 14.9625ZM21.475 18.1375L18.3 14.9625L19.75 13.5125C19.9333 13.3292 20.1667 13.2375 20.45 13.2375C20.7333 13.2375 20.9667 13.3292 21.15 13.5125L22.925 15.2875C23.1083 15.4708 23.2 15.7042 23.2 15.9875C23.2 16.2708 23.1083 16.5042 22.925 16.6875L21.475 18.1375Z" />
            </g>
          </svg>
        </Linker>
      </div>

      <div className="flex flex-col gap-3 px-6">
        {
          Array(20).fill(0).map((_, index) => (
            <Item
              key={index}
              href="/bamboo/1"
              title="외출갔다 오실때 라면 부탁드릴께요!"
              name="3학년 최재민"
              time="1시간 전"
              like={5}
              dislike={0}
              comment={3}
              isFirst={index === 0}
            />
          ))
        }
      </div>
    </div>
  );
}

export default Home;