import { usePathname } from "next/navigation";
import React from "react";

import Linker from "../Linker";

const Button = ({
  icon,
  text,
  url,
  setWidth,
}: {
  icon: React.ReactNode;
  text: string;
  url: string;
  setWidth: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const path = usePathname();
  const isSame = path.split("/")[1] === url.split("/")[1];
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current && isSame) {
      setWidth(ref.current.offsetWidth);
    }
  }, [ref.current, isSame]);

  return (
    <Linker
      href={url}
      className="py-2 flex flex-row items-center justify-center transition-all z-50"
      disabled={isSame}
    >
      <div
        ref={ref}
        className={[
          "rounded-full p-4 flex flex-row items-center justify-start gap-3",
        // isSame ? "bg-white" : ""
        ].join(" ")}
      >
        <svg className={[
          "w-6 h-6 transition-all",
          isSame ? "fill-text" : "fill-white",
        ].join(" ")} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          {icon}
        </svg>
        <p className={[
          "font-semibold text-base",
          isSame ? "text-text block" : "text-white hidden",
        ].join(" ")}>{text}</p>
      </div>
    </Linker>
  );
};

export default Button;