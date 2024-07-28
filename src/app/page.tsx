/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";

import Mover from "@/components/Mover";
import { useAuth } from "@/hooks";

import Meal from "./meal";
import Timetable from "./timetable";

const Home = () => {
  const { login, logout, user } = useAuth();

  return (
    <>
      <div className="w-full h-40 bg-text dark:bg-text-dark/30 px-4 flex flex-col items-start justify-end">
        <div
          className="bg-background dark:bg-background-dark border-8 border-background dark:border-background-dark rounded-full w-28 h-28 translate-y-1/2 overflow-hidden"
        >
          <img
            className="w-full h-full"
            src={user.profile_image || "/public/icons/icon-512-maskable.png"}
            alt="profile"
          />
        </div>
      </div>
      <div className="h-20" />
      <div className="flex flex-col gap-6">
        <div className="px-4 flex flex-row justify-between gap-4">
          <div className="flex flex-col gap-1">
            <button
              className="flex flex-row gap-1 items-center justify-start w-fit cursor-pointer"
              onClick={() => {
                window.open("https://auth.dimigo.net");
              }}
            >
              <p className="font-semibold text-2xl select-none text-text dark:text-text-dark">{user.name}</p>
              <svg className="w-5 h-5" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="fill-text dark:fill-text-dark" d="M4.664 24.1347C4.114 24.1347 3.64317 23.9388 3.2515 23.5472C2.85983 23.1555 2.664 22.6847 2.664 22.1347C2.664 21.5847 2.85983 21.1138 3.2515 20.7222C3.64317 20.3305 4.114 20.1347 4.664 20.1347H20.664C21.214 20.1347 21.6848 20.3305 22.0765 20.7222C22.4682 21.1138 22.664 21.5847 22.664 22.1347C22.664 22.6847 22.4682 23.1555 22.0765 23.5472C21.6848 23.9388 21.214 24.1347 20.664 24.1347H4.664ZM6.664 16.1347H8.064L15.864 8.35967L14.439 6.93467L6.664 14.7347V16.1347ZM4.664 17.1347V14.3097C4.664 14.1763 4.689 14.0472 4.739 13.9222C4.789 13.7972 4.864 13.6847 4.964 13.5847L15.864 2.70967C16.0473 2.52633 16.2598 2.38467 16.5015 2.28467C16.7432 2.18467 16.9973 2.13467 17.264 2.13467C17.5307 2.13467 17.789 2.18467 18.039 2.28467C18.289 2.38467 18.514 2.53467 18.714 2.73467L20.089 4.13467C20.289 4.318 20.4348 4.53467 20.5265 4.78467C20.6182 5.03467 20.664 5.293 20.664 5.55967C20.664 5.80967 20.6182 6.0555 20.5265 6.29717C20.4348 6.53883 20.289 6.75967 20.089 6.95967L9.214 17.8347C9.114 17.9347 9.0015 18.0097 8.8765 18.0597C8.7515 18.1097 8.62234 18.1347 8.489 18.1347H5.664C5.38067 18.1347 5.14317 18.0388 4.9515 17.8472C4.75983 17.6555 4.664 17.418 4.664 17.1347Z" />
              </svg>
            </button>
            <p className="font-semibold text-base text-text/30 dark:text-text-dark/50">
              {Math.floor(user.number / 1000)}학년 {Math.floor(user.number / 100) % 10}반 {user.number % 100}번
            </p>
          </div>
          <div className="">
            <Mover
              className="bg-text dark:bg-text-dark text-white dark:text-white-dark rounded-xl px-6 py-3"
              onClick={user.id ? logout : login}
            >
              {user.id ? "로그아웃" : "로그인하기"}
            </Mover>
          </div>
        </div>

        <Meal />
        <Timetable />
        <div className="h-2" />
      </div>
    </>
  );
};

export default Home;