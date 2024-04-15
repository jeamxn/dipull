"use client";

import React from "react";
import { useSetRecoilState } from "recoil";

import { alert } from "@/utils/alert";
import instance from "@/utils/instance";
import { isDarkColor } from "@/utils/isDarkColor";
import { rand } from "@/utils/random";
import { isFireworkFrameAtom } from "@/utils/states";

const Fast = () => {
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
  const speedup = () => {
    const colors = ["blue", "black", "red", "white"];
    put();
    let type = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? 1 : 0;
    const color = () => {
      document.documentElement.style.setProperty("--transition-default", " ");
      document.documentElement.style.setProperty("--color-background", `var(--color-background-${colors[type]})`);
      document.documentElement.style.setProperty("--color-text", `var(--color-text-${colors[type]})`);
      document.documentElement.style.setProperty("--color-white", `var(--color-white-${colors[type]})`);
      type += 1;
      if(type === colors.length) type = 0;
    };
    color();
    setInterval(color, 50);
  };
  React.useEffect(() => {
    const setColor = () => {
      document.documentElement.style.setProperty("--key-color", getColor());
    };
    setColor();
    const interval = setInterval(setColor, 1000);
    get();

    return () => clearInterval(interval);
  }, []);

  const get = async () => {
    try {
      const res = await instance("/api/joke");
      console.log(res.data.isJoking);
      if(res.data.isJoking) speedup();
    } catch(e) {
      console.error(e);
    }
  };

  const put = async () => {
    try {
      await instance.put("/api/joke");
    } catch(e) {
      console.error(e);
    }
  };

  const setIsFireworkFrame = useSetRecoilState(isFireworkFrameAtom);
  const firework = () => {
    setIsFireworkFrame(true);
    document.getElementsByTagName("html")[0].style.background = "transparent";
    document.getElementsByTagName("body")[0].style.background = "transparent";
  };

  return (
    <>
      {/* <p className="text-text/40 text-sm font-bold">[ 주의 :: 이 사이트는 광과민성 발작을 유발할 수 있습니다 ]</p> */}
      {/* <p className="text-text/40 text-sm">[⚠️ 위험, 충격, 공포, 기괴 ⚠️] 절대 <button className="text-primary/40 underline" onClick={speedup}>여기</button>를 누르지 마세요!</p> */}
      <p className="text-text/40 text-sm">축하해줄 일이 있나요? <button className="text-primary/40 underline" onClick={firework}>여기</button>를 누르세요!</p>
      <p className="text-primary/40 underline cursor-pointer" onClick={() => alert.info("개발 테스트 창", {
        autoClose: 50000000000000
      })}>개발 테스트 버튼</p>
      <p></p>
      <p></p>
    </>
  );
};

export default Fast;