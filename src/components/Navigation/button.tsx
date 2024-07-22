import { usePathname } from "next/navigation";
import React from "react";

import Linker from "../Linker";

const Button = ({
  icon,
  text,
  url,
}: {
  icon: React.ReactNode;
  text: string;
  url: string;
}) => {
  const path = usePathname();
  return (
    <Linker href={url} className="py-2 flex flex-row items-center justify-center transition-all">
      {
        path === url ? (
          <div className="bg-white rounded-full p-4 flex flex-row items-center justify-start gap-3">
            <svg className="fill-text w-6 h-6" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              {icon}
            </svg>
            <p className="font-semibold text-base">{text}</p>
          </div>
        ) : (
          <div className="rounded-full p-4 flex flex-row items-center justify-start gap-3">
            <svg className="fill-white w-6 h-6" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              {icon}
            </svg>
          </div>
        )
      }
    </Linker>
  );
};

export default Button;