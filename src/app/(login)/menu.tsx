"use client";

import * as jose from "jose";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { TokenInfo, defaultUserData } from "@/app/auth/type";

const menu = [
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
    url: "/atheletic/score",
    name: "체대",
  }
];

const Menu = () => {
  const pathname = usePathname();
  const [menuCopy, setMenuCopy] = React.useState(menu);
  const [userInfo, setUserInfo] = React.useState(defaultUserData);

  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")!;
    const decrypt = jose.decodeJwt(accessToken) as TokenInfo;
    setUserInfo(decrypt.data);
  }, []);

  React.useEffect(() => {
    if(userInfo.type !== "teacher") return;
    setMenuCopy([
      ...menuCopy, 
      {
        url: "/teacher/edit",
        name: "관리",
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