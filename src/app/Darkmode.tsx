"use client";

import React from "react";

const Darkmode = () => {
  React.useEffect(() => {
    const isDarkMode = window.navigator.userAgent.includes("{isDark property}");
    document.documentElement.setAttribute("color-theme", isDarkMode ? "dark" : "light");

    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQueryList.addEventListener("change", (e) => {
      document.documentElement.setAttribute("color-theme", e.matches ? "dark" : "light");
    });
    return () => mediaQueryList.removeEventListener("change", () => {});
  }, []);
  return <></>;
};

export default Darkmode;