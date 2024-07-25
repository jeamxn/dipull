import React from "react";

import Move from "./move";

const Target = ({
  current,
  setCurrent,
  maxCurrent,
}: {
  current: number;
    setCurrent: React.Dispatch<React.SetStateAction<number>>;
  maxCurrent: number;
}) => { 
  return (
    <div className="w-full flex flex-row gap-1 items-center justify-center px-4">
      <Move
        index={1}
        current={current}
        setCurrent={setCurrent}
      />
      {
        Array(5).fill(0).map((_, index) => {
          const _this_cur =
            current < 3 ? 3 :
              current > maxCurrent - 2 ? maxCurrent - 2 : current;
          const _this = _this_cur + index - 2;
          if (_this < 2 || _this > maxCurrent - 1) {
            return null;
          }
          return (
            <React.Fragment key={index}>
              {
                index === 0 && _this > 2 ? (
                  <p className="text-lg font-medium text-text dark:text-text-dark">⋯</p>
                ) : null
              }
              <Move
                index={_this}
                current={current}
                setCurrent={setCurrent}
              />
              {
                index === 4 && _this < maxCurrent - 1 ? (
                  <p className="text-lg font-medium text-text dark:text-text-dark">⋯</p>
                ) : null
              }
            </React.Fragment>
          );
        })
      }
      {
        maxCurrent > 1 ? (
          <Move
            index={maxCurrent}
            current={current}
            setCurrent={setCurrent}
          />
        ) : null
      }
    </div>
  );
};

export default Target;