"use client";

import React from "react";

import Insider from "@/provider/insider";

import Menu from "../menu";

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
      "start": "09:00",
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

const ScheduleBox = ({
  event,
  location,
  grading,
  participants,
  etc,
  time,
}:{
  event: string;
  location: string;
  grading: string;
  participants: {

  };
  etc: string;
  time: {
    start: string;
    end: string;
  };

}) => {
  const [clicked, setClicked] = React.useState(false);
  return (
    <figure 
      onClick={() => setClicked(p => !p)}
      className={[
        "w-full bg-white border border-text/10 px-4 py-2 rounded-md flex flex-col gap-1 select-none",
        // loading ? "loading_background" : "",
      ].join(" ")}
    >
      <div className="flex flex-row justify-between">
        <p>{event}</p> 
        <p>{time.start} ~ {time.end}</p>
      </div>
      {
        clicked && <>
          <p>• 위치 : {location}</p>
          <p>• 배점 : {grading}</p>
          {/* <p>{participants}</p> */}
          <p>• 기타 : {etc}</p>
        </>
        // clicked && Object.entries(machine.time).map(([key, value], i) => (
        //   <p key={i} className={[
        //     "text-sm",
        //     !value ? "opacity-30" : "opacity-100"
        //   ].join(" ")}>
        //     <b className="font-semibold">{key}</b> {value}
        //   </p>
        // ))
      }
    </figure>
  );
};

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