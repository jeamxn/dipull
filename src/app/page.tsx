"use client";

import React from "react";

import Insider from "@/provider/insider";

import Meal from "./meal";
import Timetable from "./timetable";

const Home = () => {
  return (
    <Insider className="flex flex-col gap-5">
      {/* <Timetable /> */}
      <Meal />
    </Insider>
  );
};


export default Home;