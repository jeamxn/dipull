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
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className="fill-primary" d="M12.382 8.675H26.325V22.618L35 31.293V0H3.70703L12.382 8.675Z" />
          <path className="fill-primary" d="M22.618 26.325H8.675V12.382L0 3.70703V35H31.293L22.618 26.325Z" />
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