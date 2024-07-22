"use client";

import { usePathname } from "next/navigation";
import React from "react";

import Button from "./button";
import { Links } from "./links";

const Navigation = () => { 
  const path = usePathname();
  const show = Links.some((link) => link.url === path);
  const findIndex = Links.findIndex((link) => link.url === path);
  const [width, setWidth] = React.useState(0);

  return show ? (
    <div className="absolute bottom-8 w-full flex flex-row items-center justify-center">
      <div
        className={[
          "h-full transition-all absolute py-2",
        ].join(" ")}
        style={{
          width,
          transform: `translateX(${-112 + 56 * findIndex}px)`,
        }}
      >
        <div className="w-full h-full bg-white rounded-full" />
      </div>
      <div className="bg-text/80 rounded-full flex flex-row gap-0 items-center justify-center px-2">
        {
          Links.map((link) => (
            <Button
              key={link.url}
              icon={link.icon}
              text={link.text}
              url={link.url}
              setWidth={setWidth}
            />
          ))
        }
      </div>
    </div>
  ) : null;
};

export default Navigation;