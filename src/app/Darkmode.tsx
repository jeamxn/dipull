"use client";

import React from "react";

const Darkmode = () => {
  React.useEffect(() => {
    const isDarkMode = window.navigator.userAgent.includes("{isDark property}") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("color-theme", isDarkMode ? "dark" : "light");

    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQueryList.addEventListener("change", () => {
      const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("color-theme", isDarkMode ? "dark" : "light");
    });
    return () => mediaQueryList.removeEventListener("change", () => {});
  }, []);
  return <></>;
};

export default Darkmode;