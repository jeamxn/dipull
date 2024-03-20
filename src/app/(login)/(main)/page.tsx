"use client";

import React from "react";

import Comments from "@/components/comments";
import Insider from "@/provider/insider";

import Iwannagohome from "./iwannagohome";
// import Meal from "./meal";
// import Timetable from "./timetable";

const Home = () => {
  return (
    <Insider>
      <Iwannagohome />
      {/* <Timetable /> */}
      <Comments />
      {/* <Meal /> */}
      <article className="w-full flex justify-center items-center -m-2">
        <p className="text-text/40 text-sm">급식 확인은 <a className="text-primary/40 underline" href="https://디미고급식.com/" target="_blank" rel="noreferrer">디미고 급식</a>에서 확인해주세요!</p>
      </article>
    </Insider>
  );
};

export default Home;
