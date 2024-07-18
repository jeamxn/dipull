"use client";

import React from "react";
import { useSetRecoilState } from "recoil";

import { darkModeAtom } from "@/utils/states";

const Darkmode = () => {
  const setDarkmode = useSetRecoilState(darkModeAtom);
  React.useEffect(() => {
    const isDarkMode = window.navigator.userAgent.includes("{isDark property}") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("color-theme", isDarkMode ? "dark" : "light");
    setDarkmode(isDarkMode);
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQueryList.addEventListener("change", () => {
      const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("color-theme", isDarkMode ? "dark" : "light");
      setDarkmode(isDarkMode);
    });
    return () => mediaQueryList.removeEventListener("change", () => {});
  }, []);
  return <></>;
};

export default Darkmode;