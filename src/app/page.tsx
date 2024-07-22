/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function Home() {
  return (
    <>
      <div className="w-full h-40 bg-text/80 px-6 flex flex-col items-start justify-end">
        <div
          className="bg-text border-4 border-background rounded-full w-28 h-28 translate-y-1/2"
        >
          <img
            className="rounded-full w-full h-full"
            src="https://lh3.googleusercontent.com/a/ACg8ocKyDiVdNK5iuPoyj3TGnsK7daSEj3ciCDPT99KKr_qq10tUvmoC=s96-c"
            alt="profile"
          />
        </div>
      </div>
      <div className="h-20" />
      <div className="px-6 flex flex-col gap-6">
        <div className="flex flex-row justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-2xl">최재민</p>
            <p className="font-semibold text-base text-text/30 dark:text-text/50">2023년 08월 14일 가입</p>
          </div>
          <div className="flex flex-row gap-1">
            <button
              className="bg-text/80 text-white rounded-lg px-4 py-2"
            >정보수정</button>
            <button
              className="bg-text/80 text-white rounded-lg px-4 py-2"
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
                  <div className="snap-center max-md:w-[max(calc(50vw-20px),250px)] w-[250px] overflow-hidden" key={i}>
                    <div 
                      className={[
                        "p-4 bg-white rounded-md border border-text/10 dark:border-text/20 w-full h-full",
                      ].join(" ")}
                    >
                      <p className="text-lg font-medium">아침</p>
                      <p className="overflow-hidden">sdfasdf</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xl font-semibold">시간표</p>
          <table className="w-full table-fixed border border-text/10 dark:border-text/20 bg-white">
            <tbody className="w-full">
              <tr>
                <th className="w-8 py-2 text-primary text-sm font-semibold border-r border-text/10 dark:border-text/20">-</th>
                <th className="px-2 py-2 text-primary text-sm font-semibold">월</th>
                <th className="px-2 py-2 text-primary text-sm font-semibold">화</th>
                <th className="px-2 py-2 text-primary text-sm font-semibold">수</th>
                <th className="px-2 py-2 text-primary text-sm font-semibold">목</th>
                <th className="px-2 py-2 text-primary text-sm font-semibold">금</th>
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
