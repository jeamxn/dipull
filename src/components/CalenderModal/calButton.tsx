import { Moment } from "moment";
import React from "react";

const CalButton = ({
  date,
  prev = false,
  next = false,
  clicked: seleted,
  setClicked: setSelected,
  show: current,
  setShow: setCurrent,
}: {
    date: number | string;
    prev?: boolean;
    next?: boolean;
    clicked: Moment;
    setClicked: React.Dispatch<React.SetStateAction<Moment>>;
    show: Moment;
    setShow: React.Dispatch<React.SetStateAction<Moment>>;
  }) => {
  const origin = current.clone().date(Number(date));
  const _this = prev ? origin.clone().subtract(1, "month") : 
    next ? origin.clone().add(1, "month") : origin;
  const same = _this.format("YYYY-MM-DD") === seleted.format("YYYY-MM-DD");
  return (
    <button
      className={[
        "w-full flex flex-row items-center justify-center duration-150",
        prev || next ? "opacity-30 dark:opacity-40" : "",
      ].join(" ")}
      onClick={() => { 
        setSelected(_this);
      }}
    >
      <div className={[
        "w-10 h-10 flex flex-col items-center justify-center rounded-full duration-150",
        same ? "bg-text dark:bg-text-dark" : "bg-transparent",
      ].join(" ")}>
        <p className={[
          "font-normal duration-150",
          same ? "text-white dark:text-white-dark" :
            _this.day() === 0 ? "text-red-600 dark:text-red-300" :
              _this.day() === 6 ? "text-blue-700 dark:text-blue-400" :
                "text-text dark:text-text-dark",
        ].join(" ")}>{date}</p>
      </div>
    </button>
  );
};

export default CalButton;