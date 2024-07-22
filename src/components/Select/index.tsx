import React from "react";

const Select = ({
  options,
  value,
  setValue,
}: {
    options: string[];
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
  }) => { 
  const [show, setShow] = React.useState(false);
  return (
    <div className="flex flex-row gap-0 cursor-pointer relative">
      <div
        className={[
          "absolute -bottom-1 bg-background transition-all cursor-pointer translate-y-full border border-text/10 dark:border-text/20 rounded shadow-md",
          show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none hidden",
        ].join(" ")}
      >
        {
          options.map((option, index) => (
            <p
              key={index}
              className={[
                "px-4 py-2 hover:bg-text/10 dark:hover:bg-text/20 w-full whitespace-nowrap",
                index === 0 ? "" : "border-t border-text/10 dark:border-text/20",
              ].join(" ")}
              onClick={() => {
                setValue(option);
                setShow(false);
              }}
            >{option}</p>
          ))
        }
      </div>
      <p
        className="text-xl font-semibold select-none transition-all"
        onClick={() => setShow(p => !p)}
      >
        {value}
      </p>
      <div onClick={() => setShow(p => !p)}>
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_385_124" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="25">
            <rect y="0.4375" width="24" height="24" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask0_385_124)">
            <path className="fill-text" d="M11.3 14.7375L8.69998 12.1375C8.38331 11.8208 8.31248 11.4583 8.48748 11.05C8.66248 10.6417 8.97498 10.4375 9.42498 10.4375H14.575C15.025 10.4375 15.3375 10.6417 15.5125 11.05C15.6875 11.4583 15.6166 11.8208 15.3 12.1375L12.7 14.7375C12.6 14.8375 12.4916 14.9125 12.375 14.9625C12.2583 15.0125 12.1333 15.0375 12 15.0375C11.8666 15.0375 11.7416 15.0125 11.625 14.9625C11.5083 14.9125 11.4 14.8375 11.3 14.7375Z" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Select;