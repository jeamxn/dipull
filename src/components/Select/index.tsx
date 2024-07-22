"use client";

import React from "react";

const Select = ({
  label,
  placeholder,
  options,
  value,
  onClick,
  showConfirmButton = true,
  confirmButtonText = "확인",
  showCancelButton = false,
  cancelButtonText = "취소",
  autoClose = false,
}: {
  label?: string;
  placeholder?: string;
  options?: string[];
  value?: string;
  onClick?: (value?: string) => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  autoClose?: boolean;
  }) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const [selected, setSelected] = React.useState<string>();

  React.useEffect(() => {
    setSelected(options?.find((option) => option === value) || "");
  }, [showDetails]);

  return (
    <>
      <div className="flex flex-col gap-2 px-6">
        {
          label ? (
            <p className="font-medium text-base text-text/50">{label}</p>
          ) : null
        }
        <div
          className="cursor-pointer w-full rounded bg-text/10 hover:bg-text/20 dark:bg-text/15 dark:hover:bg-text/20 flex flex-row items-center justify-between px-4 py-3"
          onClick={() => setShowDetails(true)}
        >
          <p className="font-medium select-none">{value || placeholder}</p>
          <div
            className={[
              "transition-transform",
              showDetails ? "rotate-180" : "",
            ].join(" ")}
          >
            <svg className="w-6 h-6 fill-text" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="fill-inherit" d="M11.3 14.7375L8.69998 12.1375C8.38331 11.8208 8.31248 11.4583 8.48748 11.05C8.66248 10.6417 8.97498 10.4375 9.42498 10.4375H14.575C15.025 10.4375 15.3375 10.6417 15.5125 11.05C15.6875 11.4583 15.6166 11.8208 15.3 12.1375L12.7 14.7375C12.6 14.8375 12.4916 14.9125 12.375 14.9625C12.2583 15.0125 12.1333 15.0375 12 15.0375C11.8666 15.0375 11.7416 15.0125 11.625 14.9625C11.5083 14.9125 11.4 14.8375 11.3 14.7375Z" />
            </svg>
          </div>
        </div>
      </div>

      <div
        className={[
          "absolute bottom-0 w-full h-full z-[99] bg-text/20 transition-all cursor-pointer",
          showDetails ? "opacity-100 bg-text pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setShowDetails(false)}
      />
      <div className={[
        "absolute bottom-0 w-full px-6 z-[100] bg-background border-t rounded-t-3xl pt-6 pb-safe-offset-6 transition-all",
        // showDetails ? "translate-y-0 l" : "translate-y-full hidden",
        showDetails ? "opacity-100 pointer-events-auto flex flex-col gap-4" : "opacity-0 pointer-events-none hidden",
      ].join(" ")}>
        <div className="flex flex-row items-center justify-center w-full">
          <div
            className="bg-text/15 dark:bg-text/30 w-16 h-1 cursor-pointer"
            onClick={() => setShowDetails(false)}
          />
        </div>
        {
          label ? (
            <div className="w-full flex flex-row items-center justify-center">
              <p className="font-semibold text-lg">{label}</p>
            </div>
          ) : null
        }
        <div className="flex flex-col gap-0">
          {
            options?.map((option, index) => (
              <div
                key={index}
                className="cursor-pointer select-none w-full py-4 flex flex-row gap-2 items-center justify-start transition-all"
                onClick={() => {
                  setSelected(option);
                  if (autoClose) {
                    onClick?.(option);
                    setShowDetails(false);
                  }
                }}
              >
                <svg className="w-4 h-4 transition-all" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_469_5033" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
                    <rect width="16" height="16" fill="#D9D9D9"/>
                  </mask>
                  {
                    selected === option ? (
                      <g mask="url(#mask0_469_5033)">
                        <path className="fill-text" d="M8.00004 11.3335C8.92226 11.3335 9.70837 11.0085 10.3584 10.3585C11.0084 9.7085 11.3334 8.92238 11.3334 8.00016C11.3334 7.07794 11.0084 6.29183 10.3584 5.64183C9.70837 4.99183 8.92226 4.66683 8.00004 4.66683C7.07782 4.66683 6.29171 4.99183 5.64171 5.64183C4.99171 6.29183 4.66671 7.07794 4.66671 8.00016C4.66671 8.92238 4.99171 9.7085 5.64171 10.3585C6.29171 11.0085 7.07782 11.3335 8.00004 11.3335ZM8.00004 14.6668C7.07782 14.6668 6.21115 14.4918 5.40004 14.1418C4.58893 13.7918 3.88337 13.3168 3.28337 12.7168C2.68337 12.1168 2.20837 11.4113 1.85837 10.6002C1.50837 9.78905 1.33337 8.92238 1.33337 8.00016C1.33337 7.07794 1.50837 6.21127 1.85837 5.40016C2.20837 4.58905 2.68337 3.8835 3.28337 3.2835C3.88337 2.6835 4.58893 2.2085 5.40004 1.8585C6.21115 1.5085 7.07782 1.3335 8.00004 1.3335C8.92226 1.3335 9.78893 1.5085 10.6 1.8585C11.4112 2.2085 12.1167 2.6835 12.7167 3.2835C13.3167 3.8835 13.7917 4.58905 14.1417 5.40016C14.4917 6.21127 14.6667 7.07794 14.6667 8.00016C14.6667 8.92238 14.4917 9.78905 14.1417 10.6002C13.7917 11.4113 13.3167 12.1168 12.7167 12.7168C12.1167 13.3168 11.4112 13.7918 10.6 14.1418C9.78893 14.4918 8.92226 14.6668 8.00004 14.6668Z" />
                      </g>
                    
                    ) : (
                      <g mask="url(#mask0_469_5028)">
                        <path className="fill-text" d="M8.00004 14.6668C7.07782 14.6668 6.21115 14.4918 5.40004 14.1418C4.58893 13.7918 3.88337 13.3168 3.28337 12.7168C2.68337 12.1168 2.20837 11.4113 1.85837 10.6002C1.50837 9.78905 1.33337 8.92238 1.33337 8.00016C1.33337 7.07794 1.50837 6.21127 1.85837 5.40016C2.20837 4.58905 2.68337 3.8835 3.28337 3.2835C3.88337 2.6835 4.58893 2.2085 5.40004 1.8585C6.21115 1.5085 7.07782 1.3335 8.00004 1.3335C8.92226 1.3335 9.78893 1.5085 10.6 1.8585C11.4112 2.2085 12.1167 2.6835 12.7167 3.2835C13.3167 3.8835 13.7917 4.58905 14.1417 5.40016C14.4917 6.21127 14.6667 7.07794 14.6667 8.00016C14.6667 8.92238 14.4917 9.78905 14.1417 10.6002C13.7917 11.4113 13.3167 12.1168 12.7167 12.7168C12.1167 13.3168 11.4112 13.7918 10.6 14.1418C9.78893 14.4918 8.92226 14.6668 8.00004 14.6668ZM8.00004 13.3335C9.48893 13.3335 10.75 12.8168 11.7834 11.7835C12.8167 10.7502 13.3334 9.48905 13.3334 8.00016C13.3334 6.51127 12.8167 5.25016 11.7834 4.21683C10.75 3.1835 9.48893 2.66683 8.00004 2.66683C6.51115 2.66683 5.25004 3.1835 4.21671 4.21683C3.18337 5.25016 2.66671 6.51127 2.66671 8.00016C2.66671 9.48905 3.18337 10.7502 4.21671 11.7835C5.25004 12.8168 6.51115 13.3335 8.00004 13.3335Z" />
                      </g>
                    )
                  }
                </svg>
                <p>{option}</p>
              </div>
            ))
          }
        </div>
        {
          showCancelButton || showConfirmButton ? (
            <div className="w-full flex flex-row items-center justify-center gap-2">
              {
                showCancelButton ? (
                  <button
                    className="w-full text-text/80 rounded-lg px-4 py-3 font-medium border border-text/80 dark:border-text/20"
                    onClick={() => setShowDetails(false)}
                  >
                    {cancelButtonText}
                  </button>
                ) : null
              }
              {
                showConfirmButton ? (
                  <button
                    className="w-full bg-text/80 text-white rounded-lg px-4 py-3 font-medium border border-text/80"
                    onClick={() => {
                      onClick?.(selected);
                      setShowDetails(false);
                    }}
                  >
                    {confirmButtonText}
                  </button>
                ) : null
              }
            </div>
          ) : null
        }
      </div>
    </>
  );
};

export default Select;