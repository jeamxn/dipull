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
          <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-white" d="M12.382 8.675H26.325V22.618L35 31.293V0H3.70703L12.382 8.675Z" />
            <path className="fill-white" d="M22.618 26.325H8.675V12.382L0 3.70703V35H31.293L22.618 26.325Z" />
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