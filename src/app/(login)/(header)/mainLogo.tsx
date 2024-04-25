"use client";

import * as jose from "jose";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

import { TokenInfo, defaultUserData } from "@/app/auth/type";

import { mainMenu, studentsMenu, teachersMenu } from "./utils";

export const optionParseToNumber = ["º", "¡", "™", "£", "¢", "∞", "§", "¶", "•", "ª"];
export const optionShiftparseToNumber = ["‚", "⁄", "€", "‹", "›", "ﬁ", "ﬂ", "‡", "°", "·"];

const MainLogo = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [menuCopy, setMenuCopy] = React.useState(mainMenu);
  const [userInfo, setUserInfo] = React.useState(defaultUserData);

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
      <Link 
        href="/"
        className="flex flex-row items-center justify-start gap-2 p-2 m-2 rounded hover:bg-text/15 cursor-pointer z-50"
      >
        <Image src="/public/logo.svg" alt="logo" width={24} height={24} />
      </Link>
      <p className="font-semibold text-base hidden max-[425px]:flex">
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