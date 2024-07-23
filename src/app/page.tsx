/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function Home() {
  return (
    <>
      <div className="w-full h-40 bg-text px-6 flex flex-col items-start justify-end">
        <div
          className="bg-background border-8 border-background rounded-full w-28 h-28 translate-y-1/2 overflow-hidden"
        >
          <img
            className="w-full h-full"
            src="https://lh3.googleusercontent.com/a/ACg8ocKyDiVdNK5iuPoyj3TGnsK7daSEj3ciCDPT99KKr_qq10tUvmoC=s96-c"
            alt="profile"
          />
        </div>
      </div>
      <div className="h-20" />
      <div className="px-6 flex flex-col gap-6">
        <div className="flex flex-row justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-1 items-center justify-start w-fit cursor-pointer">
              <p className="font-semibold text-2xl">최재민</p>
              <svg className="w-5 h-5" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_913_55" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="25">
                  <rect x="0.664001" y="0.134666" width="24" height="24" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_913_55)">
                  <path className="fill-text" d="M4.664 24.1347C4.114 24.1347 3.64317 23.9388 3.2515 23.5472C2.85983 23.1555 2.664 22.6847 2.664 22.1347C2.664 21.5847 2.85983 21.1138 3.2515 20.7222C3.64317 20.3305 4.114 20.1347 4.664 20.1347H20.664C21.214 20.1347 21.6848 20.3305 22.0765 20.7222C22.4682 21.1138 22.664 21.5847 22.664 22.1347C22.664 22.6847 22.4682 23.1555 22.0765 23.5472C21.6848 23.9388 21.214 24.1347 20.664 24.1347H4.664ZM6.664 16.1347H8.064L15.864 8.35967L14.439 6.93467L6.664 14.7347V16.1347ZM4.664 17.1347V14.3097C4.664 14.1763 4.689 14.0472 4.739 13.9222C4.789 13.7972 4.864 13.6847 4.964 13.5847L15.864 2.70967C16.0473 2.52633 16.2598 2.38467 16.5015 2.28467C16.7432 2.18467 16.9973 2.13467 17.264 2.13467C17.5307 2.13467 17.789 2.18467 18.039 2.28467C18.289 2.38467 18.514 2.53467 18.714 2.73467L20.089 4.13467C20.289 4.318 20.4348 4.53467 20.5265 4.78467C20.6182 5.03467 20.664 5.293 20.664 5.55967C20.664 5.80967 20.6182 6.0555 20.5265 6.29717C20.4348 6.53883 20.289 6.75967 20.089 6.95967L9.214 17.8347C9.114 17.9347 9.0015 18.0097 8.8765 18.0597C8.7515 18.1097 8.62234 18.1347 8.489 18.1347H5.664C5.38067 18.1347 5.14317 18.0388 4.9515 17.8472C4.75983 17.6555 4.664 17.418 4.664 17.1347Z" />
                </g>
              </svg>
            </div>
            <p className="font-semibold text-base text-text/30 dark:text-text/50">2023년 08월 14일 가입</p>
          </div>
          <div className="flex flex-row gap-1">
            {/* <button
              className="bg-text text-white rounded-lg px-4 py-2 h-fit"
            >정보수정</button> */}
            <button
              className="bg-text text-white rounded-lg px-4 py-2"
            >로그아웃</button>
          </div>
        </div>
        <div className="flex flex-row items-center justify-start gap-0">
          <div className="cursor-pointer flex flex-row items-center justify-start ">
            <p className="text-xl font-semibold select-none">2학년 6반 · 2023년 11월 29일</p>
            <svg className="w-6 h-6" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="fill-text" d="M11.3 14.7375L8.69998 12.1375C8.38331 11.8208 8.31248 11.4583 8.48748 11.05C8.66248 10.6417 8.97498 10.4375 9.42498 10.4375H14.575C15.025 10.4375 15.3375 10.6417 15.5125 11.05C15.6875 11.4583 15.6166 11.8208 15.3 12.1375L12.7 14.7375C12.6 14.8375 12.4916 14.9125 12.375 14.9625C12.2583 15.0125 12.1333 15.0375 12 15.0375C11.8666 15.0375 11.7416 15.0125 11.625 14.9625C11.5083 14.9125 11.4 14.8375 11.3 14.7375Z"/>
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xl font-semibold">급식</p>
          <div className="overflow-x-auto overflow-y-hidden snap-x snap-mandatory block">
            <div className="flex flex-row gap-2 w-max">
              {
                [1, 2, 3].map((e, i) => (
                  <div
                    className={[
                      "snap-center rounded-2xl p-6 bg-white dark:bg-text/15 flex flex-col items-start justify-end gap-2 w-[calc(25rem)] max-md:w-[max(calc(85vw-3rem),250px)] h-max",
                    ].join(" ")}
                    key={i}
                  >
                    <p className="text-xl font-bold">아침</p>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex flex-row gap-1 opacity-30">
                        <p className="font-semibold">ㅁㅇㄴㄹ</p>
                        <p>3629 최재민</p>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xl font-semibold">시간표</p>
          <table className="w-full table-fixed bg-white dark:bg-text/10">
            <tbody className="w-full">
              <tr>
                <th className="w-8 py-2 text-blue-700 dark:text-blue-400 text-sm font-semibold border-r border-text/10 dark:border-text/20">-</th>
                <th className="px-2 py-2 text-blue-700 dark:text-blue-400 text-sm font-semibold">월</th>
                <th className="px-2 py-2 text-blue-700 dark:text-blue-400 text-sm font-semibold">화</th>
                <th className="px-2 py-2 text-blue-700 dark:text-blue-400 text-sm font-semibold">수</th>
                <th className="px-2 py-2 text-blue-700 dark:text-blue-400 text-sm font-semibold">목</th>
                <th className="px-2 py-2 text-blue-700 dark:text-blue-400 text-sm font-semibold">금</th>
              </tr>
              
              <tr className="border-t border-text/10 dark:border-text/20">
                <td className="py-3 text-text/60 text-sm font-normal border-r border-text/10 dark:border-text/20 text-center">1</td>
                <td className={[
                  "px-1 py-3 whitespace-pre-line",
                  // time.changed ? "bg-text/5 dark:bg-text/10" : "",
                ].join(" ")}>
                  <p className="text-text/60 text-sm font-normal text-center whitespace-break-spaces break-all">
                    <span className="flex flex-col gap-1 items-center justify-center">
                      <span className="text-text">DB</span>
                      <span className="text-text/60"> {"time.subject" && `${"임재"}□`}</span>
                    </span>
                  </p>
                </td>
                <td className={[
                  "px-1 py-3 whitespace-pre-line",
                  // time.changed ? "bg-text/5 dark:bg-text/10" : "",
                ].join(" ")}>
                  <p className="text-text/60 text-sm font-normal text-center whitespace-break-spaces break-all">
                    <span className="flex flex-col gap-1 items-center justify-center">
                      <span className="text-text">DB</span>
                      <span className="text-text/60"> {"time.subject" && `${"임재"}□`}</span>
                    </span>
                  </p>
                </td>
                <td className={[
                  "px-1 py-3 whitespace-pre-line",
                  // time.changed ? "bg-text/5 dark:bg-text/10" : "",
                ].join(" ")}>
                  <p className="text-text/60 text-sm font-normal text-center whitespace-break-spaces break-all">
                    <span className="flex flex-col gap-1 items-center justify-center">
                      <span className="text-text">DB</span>
                      <span className="text-text/60"> {"time.subject" && `${"임재"}□`}</span>
                    </span>
                  </p>
                </td>
                <td className={[
                  "px-1 py-3 whitespace-pre-line",
                  // time.changed ? "bg-text/5 dark:bg-text/10" : "",
                ].join(" ")}>
                  <p className="text-text/60 text-sm font-normal text-center whitespace-break-spaces break-all">
                    <span className="flex flex-col gap-1 items-center justify-center">
                      <span className="text-text">DB</span>
                      <span className="text-text/60"> {"time.subject" && `${"임재"}□`}</span>
                    </span>
                  </p>
                </td>
                <td className={[
                  "px-1 py-3 whitespace-pre-line",
                  // time.changed ? "bg-text/5 dark:bg-text/10" : "",
                ].join(" ")}>
                  <p className="text-text/60 text-sm font-normal text-center whitespace-break-spaces break-all">
                    <span className="flex flex-col gap-1 items-center justify-center">
                      <span className="text-text">DB</span>
                      <span className="text-text/60"> {"time.subject" && `${"임재"}□`}</span>
                    </span>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}
