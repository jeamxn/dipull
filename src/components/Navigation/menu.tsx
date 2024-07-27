"use client";

import { usePathname } from "next/navigation";
import React from "react";

import Linker from "@/components/Linker";

const Menu = ({
  menus
}: {
  menus: {
    url: string;
    name: string;
  }[];
}) => {
  const path = usePathname();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center justify-center gap-1 px-4">
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
                  "text-xl font-semibold select-none cursor-pointer transition-all -m-2 p-2 whitespace-nowrap",
                  path === menu.url ? "text-text dark:text-text-dark" : "text-text/30 dark:text-text-dark/60",
                ].join(" ")}
                disabled={path === menu.url}
              >{menu.name}</Linker>
            </React.Fragment>
          ))
        }
      </div>
    </div>
  );
};

export default Menu;