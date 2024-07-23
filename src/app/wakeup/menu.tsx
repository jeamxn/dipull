"use client";

import { usePathname } from "next/navigation";
import React from "react";

import Linker from "@/components/Linker";

const menus = [
  {
    url: "/wakeup/list",
    name: "목록",
  },
  {
    url: "/wakeup/search",
    name: "검색하기",
  },
  {
    url: "/wakeup/my",
    name: "내 신청",
  }
];

const Menu = () => {
  const path = usePathname();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center justify-center gap-1 px-6">
        {
          menus.map((menu, index) => (
            <React.Fragment key={index}>
              {
                index === 0 ? null : (
                  <p className="text-xl font-semibold select-none text-text/30 dark:text-text-dark/60">·</p>
                )
              }
              <Linker
                href={menu.url}
                className={[
                  "text-xl font-semibold select-none cursor-pointer transition-all",
                  path === menu.url ? "text-text dark:text-text-dark" : "text-text/30 dark:text-text-dark/60",
                ].join(" ")}>{menu.name}</Linker>
            </React.Fragment>
          ))
        }
      </div>
    </div>
  );
};

export default Menu;