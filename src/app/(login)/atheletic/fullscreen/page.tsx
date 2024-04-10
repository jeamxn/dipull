"use client";

import React from "react";

import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

const Score = () => {
  const [score, setScore] = React.useState({
    white: 0,
    blue: 0,
  });

  const getScore = async () => {
    try{
      const { data: data1 } = await instance.get("/api/atheletic/score");
      setScore(data1.data.count);
    }
    catch(e){
      console.error(e);
    }
  };

  React.useEffect(() => {
    try{
      document.documentElement.requestFullscreen();
    }
    catch{
      alert.error("이 브라우저는 전체화면을 지원하지 않습니다.");
    }
    alert.info("3초마다 자동 갱신됩니다.");
    const intervalFunc = () => {
      getScore();
    };
    intervalFunc();
    const interval = setInterval(intervalFunc, 3000);
    return () => clearInterval(interval);
  }, []);

  const sum = score.blue + score.white;
  const blue_percent = (score.blue * 100 / sum) || 0;
  const white_percent = (score.white * 100 / sum) || 0;

  return (
    <>
      <div className="fixed left-0 top-0 w-full h-full bg-background flex flex-row justify-center items-center">
        <div className="bg-[#0000ff] text-[#fff] w-full h-full flex flex-col items-center justify-center transition-none">
          <p className="text-[4vw] text-inherit font-bold">청팀 전체</p>
          <p className="text-[8vw] text-inherit font-bold">{score.blue.toLocaleString()}점</p>
          <p className="text-[5vw] text-inherit font-bold">{Math.floor(blue_percent)}%</p>
        </div>
        <div className="bg-[#fff] text-[#000] w-full h-full flex flex-col items-center justify-center transition-none">
          <p className="text-[4vw] text-inherit font-bold">백팀 전체</p>
          <p className="text-[8vw] text-inherit font-bold">{score.white.toLocaleString()}점</p>
          <p className="text-[5vw] text-inherit font-bold">{Math.floor(white_percent)}%</p>
        </div>
      </div>
    </>
  );
};


export default Score;