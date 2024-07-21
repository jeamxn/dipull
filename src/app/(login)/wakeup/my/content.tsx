"use client";

import React from "react";

import { Rank } from "@/app/api/wakeup/ranking/utils";
import { WakeupDB, WakeupGET } from "@/app/api/wakeup/utils";

import List from "./\bList";
import MyAvailContent from "./MyAvailContent";
import MyListContent from "./MyListContent";

const Content = ({
  myAvail,
  initailData,
  initailRanking,
  emergency,
}: {
    myAvail: number;
    initailData: {
      all: WakeupGET;
      my: WakeupDB[];
      today: string;
      gender: "male" | "female";
      week: string;
    };
    initailRanking: Rank[];
    emergency: boolean;
  }) => { 
  const [avail, setAvail] = React.useState(myAvail);
  return (
    <>
      <MyAvailContent avail={avail} setAvail={setAvail} emergency={emergency} />
      {
        emergency ? null : (
          <List avail={avail} ranking={initailRanking} setAvail={setAvail} />
        )
      }
      <MyListContent initailData={initailData} avail={avail} setAvail={setAvail} />
    </>
  );
};

export default Content;