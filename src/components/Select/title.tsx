import React from "react";

import { SelectModalProps, useSelectModalDispatch } from "../SelectModal";

const Title = (props: SelectModalProps) => { 
  const selectModalDispatch = useSelectModalDispatch();
  const [show, setShow] = React.useState(false);

  const onShowButtonClick = () => {
    selectModalDispatch({
      type: "show",
      data: {
        ...props,
        onConfirm: (t) => {
          props.onConfirm && props.onConfirm(t);
          setShow(false);
        },
        onCancle: (t) => {
          props.onCancle && props.onCancle(t);
          setShow(false);
        },
      },
    });
    setShow(p => !p);
  };

  const findOptionIndex = props.optionValues?.findIndex((v) => v === props.value);

  return (
    <div className="flex flex-row gap-0 cursor-pointer relative">
      <p
        className="text-xl font-semibold select-none transition-all whitespace-nowrap text-text dark:text-text-dark"
        onClick={onShowButtonClick}
      >
        {
          (findOptionIndex !== -1 && props.options?.[findOptionIndex!]) ||
            props.value ||
            props.placeholder
        }
      </p>
      <div
        onClick={onShowButtonClick}
        className={[
          "transition-transform",
          show ? "rotate-180" : "",
        ].join(" ")}
      >
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className="fill-text dark:fill-text-dark" d="M11.3 14.7375L8.69998 12.1375C8.38331 11.8208 8.31248 11.4583 8.48748 11.05C8.66248 10.6417 8.97498 10.4375 9.42498 10.4375H14.575C15.025 10.4375 15.3375 10.6417 15.5125 11.05C15.6875 11.4583 15.6166 11.8208 15.3 12.1375L12.7 14.7375C12.6 14.8375 12.4916 14.9125 12.375 14.9625C12.2583 15.0125 12.1333 15.0375 12 15.0375C11.8666 15.0375 11.7416 15.0125 11.625 14.9625C11.5083 14.9125 11.4 14.8375 11.3 14.7375Z" />
        </svg>
      </div>
    </div>
  );
};

export default Title;