"use client";

import React from "react";
import { useSetRecoilState } from "recoil";

import { isFireworkFrameAtom } from "@/utils/states";

const Fast = () => {
  React.useEffect(() => {
    const setColor = () => {
      const color = localStorage.getItem("color") || "64 84 214";
      localStorage.setItem("color", color);
      document.documentElement.style.setProperty("--key-color", color);
    };
    setColor();
  }, []);

  const setIsFireworkFrame = useSetRecoilState(isFireworkFrameAtom);
  const firework = () => {
    setIsFireworkFrame(true);
    document.getElementsByTagName("html")[0].style.background = "transparent";
    document.getElementsByTagName("body")[0].style.background = "transparent";
  };

  return (
    <>
      <p className="text-text/40 text-sm">축하해줄 일이 있나요? <button className="text-primary/40 underline" onClick={firework}>눌러보세요!</button></p>
    </>
  );
};

export default Fast;