"use client";

import moment from "moment";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";

import Insider from "@/provider/insider";
import instance from "@/utils/instance";

import Menu from "../menu";

const Score = () => {
  const [score, setScore] = React.useState({
    white: 0,
    blue: 0,
  });

  const getScore = async () => {
    try{
      const { data } = await instance.get("/api/atheletic/score");
      setScore(data.data.count);
    }
    catch(e){
      console.error(e);
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      getScore();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sum = score.blue + score.white;
  const blue_percent = (score.blue * 100 / sum) || 0;
  const white_percent = (score.white * 100 / sum) || 0;

  return (
    <>
      <div className="fixed left-0 top-0 w-full h-full bg-background flex flex-row justify-center items-center">
        <div className="bg-[#0000ff] text-[#fff] w-full h-full flex flex-col items-center justify-center transition-none">
          <p className="text-[3vw] text-inherit font-bold">청팀</p>
          <p className="text-[7vw] text-inherit font-bold">{score.blue.toLocaleString()}점</p>
          <p className="text-[4vw] text-inherit font-bold">{Math.floor(blue_percent)}%</p>
        </div>
        <div className="bg-[#fff] text-[#000] w-full h-full flex flex-col items-center justify-center transition-none">
          <p className="text-[3vw] text-inherit font-bold">백팀</p>
          <p className="text-[7vw] text-inherit font-bold">{score.white.toLocaleString()}점</p>
          <p className="text-[4vw] text-inherit font-bold">{Math.floor(white_percent)}%</p>
        </div>
      </div>
    </>
  );
};


export default Score;