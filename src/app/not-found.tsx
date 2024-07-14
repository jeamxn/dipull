import React from "react";

import GoBack from "./(not-found)/goBack";

const Error = ({
  error,
  reset,
}: {
  error?: Error & { digest?: string }
  reset?: () => void
}) => {
  return (
    <>
      <div className="pt-safe-or-0"/>
      <div className="h-[calc(100dvh-max(env(safe-area-inset-top),0px)-max(env(safe-area-inset-bottom),0px))] flex flex-row justify-between flex-wrap gap-10 max-[650px]:gap-0 items-center w-full py-16 px-32 max-[650px]:px-8 max-[650px]:py-8 z-50">
        <div className="flex flex-col gap-6 max-[650px]:items-center max-[650px]:justify-center max-[650px]:w-full">
          <div className="flex flex-col gap-4 w-full max-[650px]:justify-center">
            <div className="flex flex-row gap-3 items-center max-[650px]:justify-center">
              <svg width="35" height="35" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1115_161)">
                  <path className="fill-primary" d="M26.8382 18.3641C27.7759 19.3018 29.0477 19.8286 30.3738 19.8286H55.1723C57.9338 19.8286 60.1724 22.0671 60.1724 24.8286V49.6272C60.1724 50.9533 60.6991 52.2251 61.6368 53.1628L71.4654 62.9913C74.6152 66.1411 80.0009 63.9103 80.0009 59.4558V5C80.0009 2.23857 77.7623 0 75.0009 0H20.5452C16.0907 0 13.8598 5.38571 17.0097 8.53553L26.8382 18.3641Z" />
                  <path className="fill-primary" d="M53.1628 61.6368C52.2251 60.6991 50.9533 60.1724 49.6272 60.1724H24.8286C22.0672 60.1724 19.8286 57.9338 19.8286 55.1724V30.3738C19.8286 29.0477 19.3018 27.7759 18.3641 26.8382L8.53554 17.0097C5.38572 13.8598 0 16.0907 0 20.5452V75.0009C0 77.7624 2.23858 80.0009 5 80.0009H59.4558C63.9103 80.0009 66.1412 74.6152 62.9913 71.4654L53.1628 61.6368Z" />
                </g>
                <defs>
                  <clipPath id="clip0_1115_161">
                    <rect width="80" height="80" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <p className="text-5xl text-primary font-semibold whitespace-nowrap max-[650px]:text-center">Dipull</p>
            </div>
            <p className="text-2xl text-text/60 font-medium break-words max-[650px]:text-center leading-normal animation-main">[404] 현재 페이지는 없는 페이지입니다.</p>
          </div>
          <div className="flex flex-row gap-1 max-[650px]:flex-col items-center justify-left">
            <GoBack />
          </div>
        </div>
        <div className="max-[650px]:w-full flex flex-col max-[650px]:items-center max-[650px]:justify-center">
          <svg className="w-64 w- h-64 max-[650px]:w-40"  viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1115_161)">
              <path className="fill-text/5 dark:fill-text/15" d="M26.8382 18.3641C27.7759 19.3018 29.0477 19.8286 30.3738 19.8286H55.1723C57.9338 19.8286 60.1724 22.0671 60.1724 24.8286V49.6272C60.1724 50.9533 60.6991 52.2251 61.6368 53.1628L71.4654 62.9913C74.6152 66.1411 80.0009 63.9103 80.0009 59.4558V5C80.0009 2.23857 77.7623 0 75.0009 0H20.5452C16.0907 0 13.8598 5.38571 17.0097 8.53553L26.8382 18.3641Z" fill="#4054D6"/>
              <path className="fill-text/5 dark:fill-text/15"  d="M53.1628 61.6368C52.2251 60.6991 50.9533 60.1724 49.6272 60.1724H24.8286C22.0672 60.1724 19.8286 57.9338 19.8286 55.1724V30.3738C19.8286 29.0477 19.3018 27.7759 18.3641 26.8382L8.53554 17.0097C5.38572 13.8598 0 16.0907 0 20.5452V75.0009C0 77.7624 2.23858 80.0009 5 80.0009H59.4558C63.9103 80.0009 66.1412 74.6152 62.9913 71.4654L53.1628 61.6368Z" fill="#4054D6"/>
            </g>
            <defs>
              <clipPath id="clip0_1115_161">
                <rect width="80" height="80" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
      <div className="pb-safe-or-0"/>
      <style>
        {`
          main {
            max-width: 100vw;
            overflow-y: hidden;
          }
        `}
      </style>
    </>
  );
};

export default Error;