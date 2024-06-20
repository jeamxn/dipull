"use client";

import { usePathname } from "next/navigation";
import React from "react";

import { UserData } from "@/app/auth/type";
import Linker from "@/components/Linker";

import { mainMenu, studentsMenu, teachersMenu } from "./utils";

const MobileMenu = ({
  userInfo
}: {
  userInfo: UserData
  }) => {
  const [expanded, setExpanded] = React.useState(false);
  const pathname = usePathname();
  const menuOrigin = userInfo.type === "teacher" ? [ ...mainMenu, ...teachersMenu ] : [ ...mainMenu, ...studentsMenu ];
  const menuSorted = menuOrigin.sort((a, b) => (a.order?.[userInfo.type] || -1) - (b.order?.[userInfo.type] || -1));

  React.useEffect(() => {
    const onCommandKeyDown = (event: KeyboardEvent) => {
      if(event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onCommandKeyDown);
    return () => {
      window.removeEventListener("keydown", onCommandKeyDown);
    };
  }, []);

  return (
    <>
      <nav className="hidden flex-row justify-around max-[520px]:flex z-50">
        <div 
          className={[
            "px-2 py-3 mx-2 my-1 rounded hover:bg-text/15 transition-all cursor-pointer",
            expanded ? "transform -rotate-90" : "",
          ].join(" ")}
          onClick={() => setExpanded(p => !p)}
        >
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-text" d="M1 12C0.716667 12 0.479167 11.9042 0.2875 11.7125C0.0958333 11.5208 0 11.2833 0 11C0 10.7167 0.0958333 10.4792 0.2875 10.2875C0.479167 10.0958 0.716667 10 1 10H17C17.2833 10 17.5208 10.0958 17.7125 10.2875C17.9042 10.4792 18 10.7167 18 11C18 11.2833 17.9042 11.5208 17.7125 11.7125C17.5208 11.9042 17.2833 12 17 12H1ZM1 7C0.716667 7 0.479167 6.90417 0.2875 6.7125C0.0958333 6.52083 0 6.28333 0 6C0 5.71667 0.0958333 5.47917 0.2875 5.2875C0.479167 5.09583 0.716667 5 1 5H17C17.2833 5 17.5208 5.09583 17.7125 5.2875C17.9042 5.47917 18 5.71667 18 6C18 6.28333 17.9042 6.52083 17.7125 6.7125C17.5208 6.90417 17.2833 7 17 7H1ZM1 2C0.716667 2 0.479167 1.90417 0.2875 1.7125C0.0958333 1.52083 0 1.28333 0 1C0 0.716667 0.0958333 0.479167 0.2875 0.2875C0.479167 0.0958333 0.716667 0 1 0H17C17.2833 0 17.5208 0.0958333 17.7125 0.2875C17.9042 0.479167 18 0.716667 18 1C18 1.28333 17.9042 1.52083 17.7125 1.7125C17.5208 1.90417 17.2833 2 17 2H1Z" />
          </svg>
        </div>
      </nav>
      <div className={[
        "hidden max-[520px]:flex flex-col gap-2 justify-center items-center fixed top-0 left-0 w-full bg-background transition-all overflow-hidden z-40",
        expanded ? "max-h-[100vh] h-[100vh]" : "max-h-0 h-0",
      ].join(" ")}
      style={{
        backdropFilter: "blur(24px)"
      }}
      >
        {
          menuSorted.map((item, index) => {
            const isCurrentPage = pathname.split("/")[1] !== "teacher" ?
              pathname.split("/")[1] === item.url.split("/")[1] : pathname.split("/")[2] === item.url.split("/")[2];
            return (
              <Linker
                key={index} 
                href={item.url}
                className={[
                  "w-full text-center p-4 font-semibold hover:text-text/100 transition-colors text-2xl",
                  isCurrentPage ? "text-text/100" : "text-text/40",
                ].join(" ")}
                prefetch={true}
                onClick={() => setExpanded(false)}
                disabled={isCurrentPage}
              >
                {item.showname || item.name}
              </Linker>
            );
          })
        }
      </div>
    </>
  );
};

export default MobileMenu;