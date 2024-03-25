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
    </Insider>
  );
};

export default Home;
