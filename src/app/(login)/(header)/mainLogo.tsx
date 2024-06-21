"use client";

import * as jose from "jose";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { TwitterPicker } from "react-color";

import { TokenInfo, defaultUserData } from "@/app/auth/type";

import { mainMenu, studentsMenu, teachersMenu } from "./utils";

export const optionParseToNumber = ["º", "¡", "™", "£", "¢", "∞", "§", "¶", "•", "ª"];
export const optionShiftparseToNumber = ["‚", "⁄", "€", "‹", "›", "ﬁ", "ﬂ", "‡", "°", "·"];

const MainLogo = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [menuCopy, setMenuCopy] = React.useState(mainMenu);
  const [userInfo, setUserInfo] = React.useState(defaultUserData);
  const [clicked, setClicked] = React.useState(false);

  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")!;
    const decrypt = jose.decodeJwt(accessToken) as TokenInfo;
    setUserInfo(decrypt.data);
  }, []);

  React.useEffect(() => {
    if(userInfo.type === "teacher") setMenuCopy([ ...mainMenu, ...teachersMenu ]);
    else setMenuCopy([ ...mainMenu, ...studentsMenu ]);
  }, [userInfo]);

  React.useEffect(() => {
    const onCommandKeyDown = (event: KeyboardEvent) => {
      if(event.altKey) {
        if(event.key >= "1" && event.key <= "9") {
          const index = parseInt(event.key) - 1;
          if(menuCopy[index]) router.push(menuCopy[index].url);
        }
        if(optionParseToNumber.includes(event.key)) {
          const index = optionParseToNumber.indexOf(event.key) - 1;
          if(menuCopy[index]) router.push(menuCopy[index].url);
        }
      }
    };
    window.addEventListener("keydown", onCommandKeyDown);
    return () => {
      window.removeEventListener("keydown", onCommandKeyDown);
    };
  }, [pathname, menuCopy]);

  React.useEffect(() => {
    //다른 곳 눌렀을 때 isClicked를 false로 만들어야 함
    const handleClick = (e: MouseEvent) => {
      if(
        !(e.target as HTMLElement).closest(".logo-icon") 
        && !(e.target as HTMLElement).closest(".color-picker")
      ) {
        setClicked(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="flex flex-row items-center justify-center">
      <div
        className="logo-icon flex flex-row items-center justify-start gap-2 p-2 m-2 rounded hover:bg-text/15 cursor-pointer z-50 w-10 h-10 relative"
        onClick={() => setClicked(p => !p)}
      >
        <svg width="35" height="35" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_1115_161)">
            <path className="fill-primary" d="M26.8382 18.3641C27.7759 19.3018 29.0477 19.8286 30.3738 19.8286H55.1723C57.9338 19.8286 60.1724 22.0671 60.1724 24.8286V49.6272C60.1724 50.9533 60.6991 52.2251 61.6368 53.1628L71.4654 62.9913C74.6152 66.1411 80.0009 63.9103 80.0009 59.4558V5C80.0009 2.23857 77.7623 0 75.0009 0H20.5452C16.0907 0 13.8598 5.38571 17.0097 8.53553L26.8382 18.3641Z" />
            <path className="fill-primary" d="M53.1628 61.6368C52.2251 60.6991 50.9533 60.1724 49.6272 60.1724H24.8286C22.0672 60.1724 19.8286 57.9338 19.8286 55.1724V30.3738C19.8286 29.0477 19.3018 27.7759 18.3641 26.8382L8.53554 17.0097C5.38572 13.8598 0 16.0907 0 20.5452V75.0009C0 77.7624 2.23858 80.0009 5 80.0009H59.4558C63.9103 80.0009 66.1412 74.6152 62.9913 71.4654L53.1628 61.6368Z" />
          </g>
          <defs>
            <clipPath id="clip0_1115_161">
              <rect width="80" height="80" fill="white"/>
            </clipPath>
          </defs>
        </svg>
        {
          clicked ? (
            <TwitterPicker
              color={localStorage.getItem("color") || "#4054d6"}
              onChange={(color) => {
                const colorRgb = color.rgb.r + " " + color.rgb.g + " " + color.rgb.b;
                localStorage.setItem("color", colorRgb);
                document.documentElement.style.setProperty("--key-color", colorRgb);
              }}
              className="color-picker absolute z-50 top-14 -ml-[0.625rem]"
            />
          ) : null
        }
      </div>
      <p className="font-semibold text-base hidden max-[520px]:flex whitespace-nowrap">
        {
          menuCopy.map((item, index) => {
            const isCurrentPage = pathname.split("/")[1] !== "teacher" ?
              pathname.split("/")[1] === item.url.split("/")[1] : pathname.split("/")[2] === item.url.split("/")[2];
            return isCurrentPage ? item.showname || item.name : null;
          })
        }
      </p>
    </div>
  );
};

export default MainLogo;