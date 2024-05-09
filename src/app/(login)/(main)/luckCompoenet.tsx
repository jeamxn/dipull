import React from "react";

import { LuckData } from "@/app/api/luck/utils";

const LuckComponent = ({
  keyString,
  value,
  loading,
}: {
  keyString: keyof LuckData;
  value: string;
  loading: boolean;
}) => {
  const [selected, setSelected] = React.useState(false);
  return (
    <article 
      className={[
        "-my-2 py-2 px-2 flex flex-col gap-1 justify-start items-start overflow-auto w-full cursor-pointer",
        loading ? "loading_background" : "",
      ].join(" ")}
      onClick={() => {
        setSelected(p => !p);
      }}
    >
      <div className="flex flex-row justify-between items-center gap-2 w-full select-none">
        <h1 className="text-base font-semibold">{keyString}</h1>
        <svg 
          width="12" 
          height="7" 
          viewBox="0 0 12 7" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={[
            "transform transition-transform duration-300",
            selected ? "rotate-180" : "",
          ].join(" ")}
        >
          <path className="fill-text" d="M5.9998 6.95002C5.86647 6.95002 5.74147 6.92919 5.6248 6.88752C5.50814 6.84586 5.3998 6.77502 5.2998 6.67502L0.699805 2.07502C0.516471 1.89169 0.424805 1.65836 0.424805 1.37502C0.424805 1.09169 0.516471 0.858358 0.699805 0.675024C0.883138 0.491691 1.11647 0.400024 1.3998 0.400024C1.68314 0.400024 1.91647 0.491691 2.0998 0.675024L5.9998 4.57502L9.89981 0.675024C10.0831 0.491691 10.3165 0.400024 10.5998 0.400024C10.8831 0.400024 11.1165 0.491691 11.2998 0.675024C11.4831 0.858358 11.5748 1.09169 11.5748 1.37502C11.5748 1.65836 11.4831 1.89169 11.2998 2.07502L6.6998 6.67502C6.5998 6.77502 6.49147 6.84586 6.3748 6.88752C6.25814 6.92919 6.13314 6.95002 5.9998 6.95002Z" />
        </svg>
      </div>
      {
        selected ? (
          <p className="text-base">{value}</p>
        ) : null
      }
    </article>
  );
};

export default LuckComponent;