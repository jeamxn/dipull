"use client";

import React from "react";
import QRCode from "react-qr-code";

const Qrcode = ({
  number
}: {
  number: string | number;
}) => {
  const [clicked, setClicked] = React.useState(false);
  return (
    <>
      <div 
        className="p-2 bg-white rounded border border-text/10 cursor-pointer" 
        onClick={() => setClicked(true)}
      >
        <QRCode 
          value={String(number)}
          className="w-16 h-16"
          bgColor="rgb( var(--color-white) / 1 )"
          fgColor="rgb( var(--color-text) / 1 )"
        />
      </div>
      {
        clicked ? (
          <div 
            className="z-50 fixed top-0 left-0 flex flex-col gap-4 items-center justify-center backdrop-blur-xl w-full h-full"
            onClick={() => setClicked(false)}
          >
            <div className="bg-white rounded border border-text/10 p-[2vmin] w-[75vmin] h-[75vmin] aspect-square">
              <QRCode 
                value={String(number)}
                className="w-full h-full"
                bgColor="rgb( var(--color-white) / 0 )"
                fgColor="rgb( var(--color-text) / 1 )"
              />
            </div>
            <div className="flex flex-row items-center justify-center gap-2 cursor-pointer">
              <p className="text-xl">닫기</p>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.00078 8.39999L2.10078 13.3C1.91745 13.4833 1.68411 13.575 1.40078 13.575C1.11745 13.575 0.884115 13.4833 0.700781 13.3C0.517448 13.1167 0.425781 12.8833 0.425781 12.6C0.425781 12.3167 0.517448 12.0833 0.700781 11.9L5.60078 6.99999L0.700781 2.09999C0.517448 1.91665 0.425781 1.68332 0.425781 1.39999C0.425781 1.11665 0.517448 0.883321 0.700781 0.699988C0.884115 0.516654 1.11745 0.424988 1.40078 0.424988C1.68411 0.424988 1.91745 0.516654 2.10078 0.699988L7.00078 5.59999L11.9008 0.699988C12.0841 0.516654 12.3174 0.424988 12.6008 0.424988C12.8841 0.424988 13.1174 0.516654 13.3008 0.699988C13.4841 0.883321 13.5758 1.11665 13.5758 1.39999C13.5758 1.68332 13.4841 1.91665 13.3008 2.09999L8.40078 6.99999L13.3008 11.9C13.4841 12.0833 13.5758 12.3167 13.5758 12.6C13.5758 12.8833 13.4841 13.1167 13.3008 13.3C13.1174 13.4833 12.8841 13.575 12.6008 13.575C12.3174 13.575 12.0841 13.4833 11.9008 13.3L7.00078 8.39999Z" fill="rgb(var(--color-text) / 1)"/>
              </svg>
            </div>
          </div>
        ) : null
      }
    </>
  );
};

export default Qrcode;