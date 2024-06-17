"use client";

import * as jose from "jose";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { TokenInfo, UserData, defaultUserData } from "@/app/auth/type";

import { mainMenu, studentsMenu, teachersMenu } from "./utils";

const Menu = ({
  userInfo
}: {
  userInfo: UserData
}) => {
  const pathname = usePathname();
  const menuCopy = userInfo.type === "teacher" ? [ ...mainMenu, ...teachersMenu ] : [ ...mainMenu, ...studentsMenu ];

  return (
    <nav className="flex flex-row justify-around max-[520px]:hidden">
      {
        menuCopy.map((item, index) => {
          const isCurrentPage = pathname.split("/")[1] === item.url.split("/")[1];
          return (
            <Link
              key={index} 
              href={item.url}
              className={[
                "w-full text-center px-4 py-2 my-2 text-sm rounded hover:bg-text/15 font-semibold transition-colors",
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