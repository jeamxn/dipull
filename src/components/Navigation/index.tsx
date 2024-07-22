"use client";

import { usePathname } from "next/navigation";
import React from "react";

import Button from "./button";
import { Links } from "./links";

const Navigation = () => { 
  const path = usePathname();
  const show = Links.some((link) => link.url === path);
  return show ? (
    <div className="absolute bottom-8 w-full flex flex-row items-center justify-center">
      <div className="bg-text/80 rounded-full flex flex-row gap-0 items-center justify-center px-2">
        {
          Links.map((link) => (
            <Button
              key={link.url}
              icon={link.icon}
              text={link.text}
              url={link.url}
            />
          ))
        }
      </div>
    </div>
  ) : null;
};

export default Navigation;