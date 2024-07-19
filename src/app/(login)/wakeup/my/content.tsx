"use client";

import React from "react";

import { WakeupDB, WakeupGET } from "@/app/api/wakeup/utils";

import MyAvailContent from "./MyAvailContent";
import MyListContent from "./MyListContent";

const Content = ({
  myAvail,
  initailData,
}: {
    myAvail: number;
    initailData: {
      all: WakeupGET;
      my: WakeupDB[];
      today: string;
      gender: "male" | "female";
      week: string;
    };
  }) => { 
  const [avail, setAvail] = React.useState(myAvail);
  return (
    <>
      <MyAvailContent avail={avail} setAvail={setAvail} />
      <MyListContent initailData={initailData} avail={avail} setAvail={setAvail} />
    </>
  );
};

export default Content;