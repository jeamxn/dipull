"use client";

import React from "react";

import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

const Score = () => {
  const [eventCurrent, setEventCurrent] = React.useState("");
  const [eventScore, setEventScore] = React.useState({
    white: 0,
    blue: 0,
  });
  const [eventSetsScore, setEventSetsScore] = React.useState({
    white: 0,
    blue: 0,
  });
  const [eventTeams, setEventTeams] = React.useState<{
    left: string;
    right: string;
  }>({
    left: "",
    right: "",
  });

  const getEventScore = async () => {
    try{
      const { data } = await instance.get("/api/atheletic/set_score");
      await getEventCurrent();
      await getEventTeams();
      setEventScore(data.data.score);
      setEventSetsScore(data.data.sets);
    }
    catch(e){
      console.error(e);
    }
  };

  const getEventTeams = async () => {
    try{
      const { data } = await instance.get("/api/atheletic/teams");
      setEventTeams(data.data);
    }
    catch(e){
      console.error(e);
    }
  };

  const getEventCurrent = async () => {
    try{
      const { data } = await instance.get("/api/atheletic/current");
      setEventCurrent(data.data);
    }
    catch(e){
      console.error(e);
    }
  };

  React.useEffect(() => {
    getEventCurrent();
    getEventTeams();
    try{
      document.documentElement.requestFullscreen();
    }
    catch{
      alert.error("이 브라우저는 전체화면을 지원하지 않습니다.");
    }
    alert.info("3초마다 자동 갱신됩니다.");
    const intervalFunc = () => {
      getEventScore();
    };
    intervalFunc();
    const interval = setInterval(intervalFunc, 3000);
    return () => clearInterval(interval);
  }, []);

  const sum = eventScore.blue + eventScore.white;
  const blue_percent = (eventScore.blue * 100 / sum) || 0;
  const white_percent = (eventScore.white * 100 / sum) || 0;

  return eventCurrent.length ? (
    <div className="fixed left-0 top-0 w-full h-full bg-background flex flex-row justify-center items-center">
      <div className="bg-[#0000ff] text-[#fff] w-full h-full flex flex-col items-center justify-center transition-none">
        <p className="text-[3vw] text-inherit font-bold">{eventCurrent} :: {eventTeams.left}</p>
        <p className="text-[7vw] text-inherit font-bold">세트 {eventSetsScore.blue.toLocaleString()}승</p>
        <p className="text-[7vw] text-inherit font-bold">{eventScore.blue.toLocaleString()}점</p>
        <p className="text-[4vw] text-inherit font-bold">{Math.floor(blue_percent)}%</p>
      </div>
      <div className="bg-[#fff] text-[#000] w-full h-full flex flex-col items-center justify-center transition-none">
        <p className="text-[3vw] text-inherit font-bold">{eventCurrent} :: {eventTeams.right}</p>
        <p className="text-[7vw] text-inherit font-bold">세트 {eventSetsScore.white.toLocaleString()}승</p>
        <p className="text-[7vw] text-inherit font-bold">{eventScore.white.toLocaleString()}점</p>
        <p className="text-[4vw] text-inherit font-bold">{Math.floor(white_percent)}%</p>
      </div>
    </div>
  ) : (
    <div className="fixed bg-[#000] left-0 top-0 w-full h-full flex flex-row justify-center items-center" />
  );
};


export default Score;