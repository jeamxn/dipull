"use client";

import React from "react";

import Insider from "@/provider/insider";

import Menu from "../menu";

import ScheduleBox from "./ScheduleBox";

const schedule = [
  {
    "event" : "오리엔테이션",
    "location": "체육관",
    "grading": "선생님 팀과의 득실차 * 100\nex) 선생님 팀 21점 : 학생 팀 15점\n→ 학생팀 점수\n{선생님 팀(21)- 학생 팀(15)} * 100 = - 600",
    "participants": {
    //   "quters": {
            
    //   }
    },
    "etc": "모든 선수들(교체 선수까지) 출전 필요",
    "time": {
      "start": "08:00",
      "end": "10:00"
    }
  },{
    "event" : "피구",
    "location": "체육관",
    "grading": "각 쿼터 승 : +2000\n각 세트 별 생존자 수 * +100",
    "participants": {
  
    },
    "etc": "모든 선수들(교체 선수까지) 출전 필요",
    "time": {
      "start": "09:00",
      "end": "10:00"
    }
  }
];

const Gallary = () => {
  const [loading, setLoading] = React.useState(false);
  
  return (
    <>
      <Menu />
      <Insider>
        <section className="flex flex-col gap-3">
          <h1 className="text-xl font-semibold">일정</h1>
          <section className="flex flex-col gap-1">
            {
              schedule.map((element) => {
                return <ScheduleBox key={element.event} {...element} />;
              })
            }
          </section>

        </section>
      </Insider>
    </>
  );
};


export default Gallary;