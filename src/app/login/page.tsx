"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

import Insider from "@/provider/insider";

const Login = () => {
  const ref = React.useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const login = async () => {
    const url = `${process.env.NEXT_PUBLIC_DIMIGOIN_URI}/oauth?client=${process.env.NEXT_PUBLIC_DIMIGOIN_KEY}&redirect=${window.location.origin}/auth`;
    router.push(url);
  };

  return (
    <Insider 
      className="w-full h-screen justify-center items-center"
    >
      <Image 
        src="/public/background.jpg"
        alt="background"
        className="blur-[16px] opacity-25 select-none object-cover object-center fill"
        fill
      />
      <button 
        className="overflow-hidden z-50 bg-primary px-8 py-8 rounded-md flex flex-col gap-6 justify-between items-center w-full max-w-[30rem]"
        onClick={login}
        ref={ref}
      >
        <section className="flex flex-row w-full justify-start items-start">
          <svg width="35" height="35" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1115_161)">
              <path className="fill-white" d="M26.8382 18.3641C27.7759 19.3018 29.0477 19.8286 30.3738 19.8286H55.1723C57.9338 19.8286 60.1724 22.0671 60.1724 24.8286V49.6272C60.1724 50.9533 60.6991 52.2251 61.6368 53.1628L71.4654 62.9913C74.6152 66.1411 80.0009 63.9103 80.0009 59.4558V5C80.0009 2.23857 77.7623 0 75.0009 0H20.5452C16.0907 0 13.8598 5.38571 17.0097 8.53553L26.8382 18.3641Z" />
              <path className="fill-white" d="M53.1628 61.6368C52.2251 60.6991 50.9533 60.1724 49.6272 60.1724H24.8286C22.0672 60.1724 19.8286 57.9338 19.8286 55.1724V30.3738C19.8286 29.0477 19.3018 27.7759 18.3641 26.8382L8.53554 17.0097C5.38572 13.8598 0 16.0907 0 20.5452V75.0009C0 77.7624 2.23858 80.0009 5 80.0009H59.4558C63.9103 80.0009 66.1412 74.6152 62.9913 71.4654L53.1628 61.6368Z" />
            </g>
            <defs>
              <clipPath id="clip0_1115_161">
                <rect width="80" height="80" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </section>
        <article className="flex flex-col gap-2 justify-center items-end w-full">
          <figure className="flex flex-row gap-2 justify-start items-center">
          
            <p className="text-white whitespace-nowrap text-base">디풀</p>
          </figure>
          <figure className="flex flex-row gap-0 justify-start items-center">
            <p className="text-xl text-white font-bold text-left whitespace-nowrap">디풀 계정</p>
            <p className="text-xl text-white font-normal text-left whitespace-nowrap">으로 로그인하기</p>
          </figure>
        </article>
      </button>     
    </Insider>
  );
};

export default Login;