"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const menu = [
  {
    url: "/jasup/my",
    name: "메인",
  },
  {
    url: "/jasup/book",
    name: "예약",
  },
  {
    url: "/jasup/statistics",
    name: "통계",
  },
];

const Menu = () => {
  const pathname = usePathname();

  return (
    <nav className="px-4 w-full border-b border-text/10 flex flex-row justify-around">
      {
        menu.map((item, index) => {
          const isCurrentPage = pathname.split("/")[2] === item.url.split("/")[2];
          return (
            <Link
              key={index} 
              href={item.url}
              className={[
                "w-full text-center py-3 text-sm font-semibold hover:text-text/100 transition-colors",
                isCurrentPage ? "border-b-2 border-primary text-text/100" : "text-text/40"
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