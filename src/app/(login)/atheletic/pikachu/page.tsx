"use client";
import React from "react";

import Comments from "@/components/comments";

import List from "./list";
import PikachuVolleyball from "./pikachuVolleyball";

const Gallary = () => {
  const [multi, setMulti] = React.useState(true);
  return (
    <>
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">피카츄 배구</h1>
          <div className="flex flex-row gap-2">
            <p 
              className={[
                "text-base cursor-pointer",
                multi ? "font-semibold text-text" : "text-text/45",
              ].join(" ")}
              onClick={() => setMulti(true)}
            >온라인 모드</p>
            <p 
              className={[
                "text-base cursor-pointer",
                !multi ? "font-semibold text-text" : "text-text/45",
              ].join(" ")}
              onClick={() => setMulti(false)}
            >오프라인 모드</p>
          </div>
        </div>
        <section className="flex flex-wrap gap-4 flex-row items-center justify-center overflow-hidden">
          <PikachuVolleyball multi={multi} />
        </section>
      </section>
      { multi ? <List /> : null }
      <Comments />
    </>
  );
};


export default Gallary;