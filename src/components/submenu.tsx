"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";

import { optionShiftparseToNumber } from "@/app/(login)/(header)/mainLogo";
import { MenuItem } from "@/app/(login)/(header)/utils";

import Linker from "./Linker";

const SubMenu = ({
  menu
}: {
  menu: MenuItem[];
}) => {
  const pathname = usePathname();
  const router = useRouter();
  React.useEffect(() => {
    const onCommandKeyDown = (event: KeyboardEvent) => {
      if(event.altKey) {
        if(event.key >= "1" && event.key <= "9") {
          const index = parseInt(event.key) - 1;
          if(menu[index]) router.push(menu[index].url);
        }
        if(optionShiftparseToNumber.includes(event.key)) {
          const index = optionShiftparseToNumber.indexOf(event.key) - 1;
          if(menu[index]) router.push(menu[index].url);
        }
      }
    };
    window.addEventListener("keydown", onCommandKeyDown);
    return () => {
      window.removeEventListener("keydown", onCommandKeyDown);
    };
  }, [pathname, menu]);

  return (
    <nav className="px-4 w-full border-b border-text/10 flex flex-row justify-around">
      {
        menu.map((item, index) => {
          const isCurrentPage = pathname.split("/")[2] === item.url.split("/")[2];
          return (
            <Linker
              key={index} 
              href={item.url}
              className={[
                "w-full text-center py-3 text-sm font-semibold hover:text-text/100 transition-colors",
                isCurrentPage ? "border-b-2 border-primary text-text/100" : "text-text/40"
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

export default SubMenu;