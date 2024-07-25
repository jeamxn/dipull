import React from "react";

const Move = ({
  index,
  current,
  setCurrent,
}: {
  index: number;
  current: number;
  setCurrent: (index: number) => void;
}) => { 
  return (
    <button
      className={[
        "w-8 h-8 flex items-center justify-center rounded-full border border-text/10 dark:border-text-dark/25",
        current === index ? "bg-text dark:bg-text-dark" : "",
      ].join(" ")}
      onClick={() => {
        setCurrent(index);
      }}
    >
      <p className={[
        "text-sm font-semibold",
        current === index ? "text-white dark:text-white-dark" : "text-text dark:text-text-dark",
      ].join(" ")}>{index}</p>
    </button>
  );
};

export default Move;