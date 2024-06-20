"use client";

import { usePathname } from "next/navigation";
import React from "react";

import { UserData } from "@/app/auth/type";
import Linker from "@/components/Linker";

import { mainMenu, studentsMenu, teachersMenu } from "./utils";

const Menu = ({
  userInfo
}: {
  userInfo: UserData
  }) => {
  const pathname = usePathname();
  const menuOrigin = userInfo.type === "teacher" ? [ ...mainMenu, ...teachersMenu ] : [ ...mainMenu, ...studentsMenu ];
  const menuSorted = menuOrigin.sort((a, b) => (a.order?.[userInfo.type] || -1) - (b.order?.[userInfo.type] || -1));

  return (
    <nav className="flex flex-row justify-around max-[520px]:hidden">
      {
        menuSorted.map((item, index) => {
          const isCurrentPage = pathname.split("/")[1] !== "teacher" ?
            pathname.split("/")[1] === item.url.split("/")[1] : pathname.split("/")[2] === item.url.split("/")[2];
          return (
            <Linker
              key={index}
              href={item.url}
              className={[
                "w-full text-center px-4 py-2 my-2 text-sm rounded hover:bg-text/15 font-semibold transition-colors",
                // isCurrentPage && pathname.split("/").length === 2 ? "border-b-2 border-primary" : "",
                isCurrentPage ? "text-text/100" : "text-text/40",
              ].join(" ")}
              prefetch={true}
              disabled={isCurrentPage}
            >
              {item.name}
            </Linker>
          );
        })
      }
    </nav>
  );
};

export default Menu;