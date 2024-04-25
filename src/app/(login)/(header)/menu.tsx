"use client";

import * as jose from "jose";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { TokenInfo, defaultUserData } from "@/app/auth/type";

import { mainMenu, studentsMenu, teachersMenu } from "./utils";

const Menu = () => {
  const pathname = usePathname();
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

  return (
    <nav className="flex flex-row justify-around max-[425px]:hidden">
      {
        menuCopy.map((item, index) => {
          const isCurrentPage = pathname.split("/")[1] === item.url.split("/")[1];
          return (
            <Link
              key={index} 
              href={item.url}
              className={[
                "w-full text-center p-4 text-sm font-semibold hover:text-text/100 transition-colors",
                // isCurrentPage && pathname.split("/").length === 2 ? "border-b-2 border-primary" : "",
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