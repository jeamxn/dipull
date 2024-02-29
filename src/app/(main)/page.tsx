"use client";

import React from "react";

import Insider from "@/provider/insider";

import Meal from "./meal";
import Timetable from "./timetable";

const Home = () => {
  return (
    <Insider>
      {/* <Timetable /> */}
      <Meal />
    </Insider>
  );
};


export default Home;