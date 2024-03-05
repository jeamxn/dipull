"use client";

import React from "react";

import Insider from "@/provider/insider";

import Iwannagohome from "./iwannagohome";
import Meal from "./meal";
import Timetable from "./timetable";

const Home = () => {
  return (
    <Insider>
      <Iwannagohome />
      <Meal />
      <Timetable />
    </Insider>
  );
};

export default Home;
