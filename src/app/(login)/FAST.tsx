"use client";

import React from "react";

import { isDarkColor } from "@/utils/isDarkColor";
import { rand } from "@/utils/random";

const Fast = () => {
  const [speed, setSpeed] = React.useState(1000);
  const getColor: () => string = () => {
    const randomR = rand(0, 255);
    const randomG = rand(0, 255);
    const randomB = rand(0, 255);
    const isDark = isDarkColor(randomR, randomG, randomB);
    const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    if(isDarkMode && isDark) return getColor();
    else if(!isDarkMode && !isDark) return getColor();
    return `${randomR} ${randomG} ${randomB}`;
  };
  React.useEffect(() => {
    const setColor = () => {
      document.documentElement.style.setProperty("--key-color", getColor());
    };
    setColor();
    const interval = setInterval(setColor, speed);
    return () => clearInterval(interval);
  }, [speed]);
  const speedup = () => {
    setSpeed(prv => prv - 100 || 1);
  };
  return (
    <p className="text-text/40 text-sm">좀 재밌는 것을 느껴볼려면 <button className="text-primary/40 underline" onClick={speedup}>여기</button>를 누르세요!</p>
  );
};

export default Fast;