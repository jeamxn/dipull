"use client";

import React from "react";

import Linker from "@/components/Linker";

const Jasup = () => {
  return (
    <article className="flex flex-col gap-3">
      <h1 className="text-xl font-semibold">자습 도우미 설정</h1>
      <article className={[
        "flex flex-row gap-2 bg-white rounded border border-text/10 p-5",
      ].join(" ")}>
        <Linker 
          href="/teacher/settings/jasup"
          className="text-base rounded h-10 hover:bg-text/10 border border-text/10 px-4 w-full transition-colors flex flex-col items-center justify-center"
        >
          자습 도우미 설정으로 이동
        </Linker>
      </article>
    </article>
  );
};

export default Jasup;