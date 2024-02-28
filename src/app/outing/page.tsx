"use client";

import React from "react";

import Insider from "@/provider/insider";

import MealOption, { OutingData, defaultOutingData } from "./mealOption";

const Home = () => {
  const [sat, setSat] = React.useState<OutingData>(defaultOutingData);
  const [sun, setSun] = React.useState<OutingData>(defaultOutingData);

  return (
    <Insider className="flex flex-col gap-5">
      <section className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold">외출 및 급식 변경 신청하기</h1>
        <MealOption 
          title="토요일"
          data={sat}
          setData={setSat}
        />
        <MealOption 
          title="일요일"
          data={sun}
          setData={setSun}
        />
      </section>
      <button 
        className="bg-primary text-white w-full text-base font-semibold rounded h-10"
        onClick={ () => {} }
      >
          신청하기
      </button>
    </Insider>
  );
};


export default Home;