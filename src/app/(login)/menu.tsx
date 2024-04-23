"use client";

import * as jose from "jose";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { TokenInfo, defaultUserData } from "@/app/auth/type";

const mainMenu = [
  {
    url: "/",
    name: "정보",
  },
  {
    url: "/wakeup/list",
    name: "기상",
  },
  {
    url: "/machine/washer",
    name: "세탁",
  },
  {
    url: "/stay/apply",
    name: "잔류",
  },
  {
    url: "/jasup/my",
    name: "자습",
  },
];

const Menu = () => {
  const pathname = usePathname();
  const [menuCopy, setMenuCopy] = React.useState(mainMenu);
  const [userInfo, setUserInfo] = React.useState(defaultUserData);

  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")!;
    const decrypt = jose.decodeJwt(accessToken) as TokenInfo;
    setUserInfo(decrypt.data);
    const isDarkMode = window.navigator.userAgent.includes("{isDark property}");
    document.documentElement.setAttribute("color-theme", isDarkMode ? "dark" : "light");

    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQueryList.addEventListener("change", (e) => {
      document.documentElement.setAttribute("color-theme", e.matches ? "dark" : "light");
    });
    return () => mediaQueryList.removeEventListener("change", () => {});
  }, []);

  React.useEffect(() => {
    if(userInfo.type === "teacher") 
      setMenuCopy([
        ...mainMenu, 
        {
          url: "/teacher/edit",
          name: "관리",
        }
      ]);
    else setMenuCopy([
      ...mainMenu,
      {
        url: "/bamboo",
        name: "대숲",
      }
    ]);
  }, [userInfo]);

  return (
    <nav className="px-4 w-full border-b border-text/10 flex flex-row justify-around">
      {
        menuCopy.map((item, index) => {
          const isCurrentPage = pathname.split("/")[1] === item.url.split("/")[1];
          return (
            <Link
              key={index} 
              href={item.url}
              className={[
                "w-full text-center py-3 text-sm font-semibold hover:text-text/100 transition-colors",
                isCurrentPage && pathname.split("/").length === 2 ? "border-b-2 border-primary" : "",
                isCurrentPage ? "text-text/100" : "text-text/40",
              ].join(" ")}
              prefetch={true}
            >
              {item.name}
            </Link>
          );
        })
      }
    </nav>
  );
};

export default Menu;