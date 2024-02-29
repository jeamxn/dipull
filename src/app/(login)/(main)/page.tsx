"use client";

import React from "react";

import Insider from "@/provider/insider";

import Meal from "./meal";
import Timetable from "./timetable";

const Home = () => {
  const [loading, setLoading] = React.useState(false);
  return (
    <Insider>
      <Timetable
        loading={loading}
        setLoading={setLoading}
      />
      <Meal 
        loading={loading}
        setLoading={setLoading}
      />
    </Insider>
  );
};


export default Home;