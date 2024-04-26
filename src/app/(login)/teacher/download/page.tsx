"use client";

import React from "react";

import { alert } from "@/utils/alert";

import HomecomingSheet from "./homecomingSheet";
import StaySheet from "./staySheet";

const Admin = () => {
  const [loading, setLoading] = React.useState(false);

  return (
    <>
      <StaySheet 
        loading={loading}
        setLoading={setLoading}
      />
      <HomecomingSheet 
        loading={loading}
        setLoading={setLoading}
      />
      <article className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold">자율학습 내역 다운로드</h1>
        <article className={[
          "flex flex-row gap-2 bg-white rounded border border-text/10 p-5",
          loading ? "loading_background" : "",
        ].join(" ")}>
          {
            new Array(3).fill(0).map((_, i) => (
              <button 
                key={i}
                onClick={() => alert.info("해당 기능은 준비 중입니다.")}
                className="text-base rounded h-10 hover:bg-text/10 border border-text/10 px-4 w-full transition-colors"
              >
                {i + 1}학년
              </button>
            ))
          }
        </article>
      </article>
    </>
  );
};

export default Admin;