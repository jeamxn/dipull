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

  return (
    <div className="flex flex-row items-center justify-center">
      <div
        className="flex flex-row items-center justify-start gap-2 p-2 m-2 rounded hover:bg-text/15 cursor-pointer z-50 w-10 h-10 relative"
        onClick={() => setClicked(p => !p)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 21" fill="none">
          <g clipPath="url(#clip0_1_1390)">
            <rect y="16.75" width="20" height="3.75" rx="1.875" className="fill-primary"></rect>
            <path className="fill-primary" d="M1.5625 7.375C1.5625 6.33947 2.40197 5.5 3.4375 5.5C4.47303 5.5 5.3125 6.33947 5.3125 7.375L5.3125 13.625C5.3125 14.6605 4.47303 15.5 3.4375 15.5C2.40197 15.5 1.5625 14.6605 1.5625 13.625L1.5625 7.375Z"></path>
            <path className="fill-primary" d="M1.5625 2.375C1.5625 1.33947 2.40197 0.5 3.4375 0.5C4.47303 0.5 5.3125 1.33947 5.3125 2.375C5.3125 3.41053 4.47303 4.25 3.4375 4.25C2.40197 4.25 1.5625 3.41053 1.5625 2.375Z"></path>
            <path className="fill-primary" fillRule="evenodd" clipRule="evenodd" d="M12.8125 2.6875C9.7059 2.6875 7.1875 5.2059 7.1875 8.3125V13.625C7.1875 14.6605 8.02697 15.5 9.0625 15.5C10.098 15.5 10.9375 14.6605 10.9375 13.625V8.3125C10.9375 7.27697 11.777 6.4375 12.8125 6.4375C13.848 6.4375 14.6875 7.27697 14.6875 8.3125V13.625C14.6875 14.6605 15.527 15.5 16.5625 15.5C17.598 15.5 18.4375 14.6605 18.4375 13.625V8.3125C18.4375 5.2059 15.9191 2.6875 12.8125 2.6875Z"></path>
          </g>
          <defs>
            <clipPath id="clip0_1_1390">
              <rect width="20" height="20" fill="white" transform="translate(0 0.5)"></rect>
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
              className="absolute z-50 top-14 bg-white -ml-[0.625rem]"
            />
          ) : null
        }
      </div>
      <p className="font-semibold text-base hidden max-[520px]:flex whitespace-nowrap">
        {
          menuCopy.map((item, index) => {
            const isCurrentPage = pathname.split("/")[1] === item.url.split("/")[1];
            return isCurrentPage ? item.showname || item.name : null;
          })
        }
      </p>
    </div>
  );
};

export default MainLogo;