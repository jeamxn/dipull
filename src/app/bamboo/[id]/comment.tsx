/* eslint-disable @next/next/no-img-element */
import React from "react";

import { MoreButton, useMoreModalDispatch } from "@/components/MoreModal";

const Comment = ({
  isFirst,
}: {
  isFirst: boolean;
  }) => {
  const [myLike, setMyLike] = React.useState<boolean>(false);
  const moreModalDispatch = useMoreModalDispatch();
  const moreButtons: MoreButton[] = [
    {
      text: "답글 수정하기",
      type: "blue",
      onClick: () => { },
    },
    {
      text: "답글 삭제하기",
      type: "red",
      onClick: () => { },
    },
    {
      text: "신고하기",
      type: "red",
      onClick: () => { },
    }
  ];

  const emotion = () => { 
    setMyLike(p => !p);
  };

  return (
    <>
      {
        isFirst ? null : (
          <div className="w-full border-b border-text/10 dark:border-text/20" />
        )
      }
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-row items-start justify-start gap-3">
          <img
            className="w-10 h-10 rounded-full border border-text/10 dark:border-text/20"
            src="https://lh3.googleusercontent.com/a/ACg8ocKyDiVdNK5iuPoyj3TGnsK7daSEj3ciCDPT99KKr_qq10tUvmoC=s96-c"
            alt="profile"
          />
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center justify-start gap-0.5">
              <p className="font-semibold text-sm">최재민</p>
              <p className="font-medium text-sm text-text/30 dark:text-text/40">·</p>
              <p className="font-medium text-sm text-text/30 dark:text-text/40">15분 전</p>
            </div>
            <div className="font-normal">
              와 제가 사올께요
            </div>
            <button
              className="flex flex-row items-center justify-start h-fit -m-2 p-2 w-fit"
              onClick={emotion}
            >
              <p className={[
                "font-medium text-sm select-none cursor-pointer duration-150",
                myLike ? "text-blue-700 dark:text-blue-400" : "text-text/50 dark:text-text/60"
              ].join(" ")}>좋아요 12개</p>
            </button>
          </div>
        </div>
        <div
          className="-m-2 p-2 cursor-pointer"
          onClick={() => {
            moreModalDispatch({
              type: "show",
              data: {
                buttons: moreButtons
              },
            });
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_324_65" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
              <rect width="20" height="20" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_324_65)">
              <path className="fill-text" d="M9.99564 15.3911C9.69652 15.3911 9.44192 15.2846 9.23185 15.0716C9.02178 14.8586 8.91675 14.6025 8.91675 14.3034C8.91675 14.0042 9.02326 13.7496 9.23627 13.5396C9.44928 13.3295 9.70535 13.2245 10.0045 13.2245C10.3036 13.2245 10.5582 13.331 10.7683 13.544C10.9783 13.757 11.0834 14.0131 11.0834 14.3122C11.0834 14.6113 10.9769 14.8659 10.7639 15.076C10.5508 15.2861 10.2948 15.3911 9.99564 15.3911ZM9.99564 11.0834C9.69652 11.0834 9.44192 10.9769 9.23185 10.7639C9.02178 10.5509 8.91675 10.2948 8.91675 9.99569C8.91675 9.69657 9.02326 9.44197 9.23627 9.2319C9.44928 9.02183 9.70535 8.9168 10.0045 8.9168C10.3036 8.9168 10.5582 9.0233 10.7683 9.23632C10.9783 9.44933 11.0834 9.7054 11.0834 10.0045C11.0834 10.3037 10.9769 10.5582 10.7639 10.7683C10.5508 10.9784 10.2948 11.0834 9.99564 11.0834ZM9.99564 6.77574C9.69652 6.77574 9.44192 6.66923 9.23185 6.45621C9.02178 6.2432 8.91675 5.98713 8.91675 5.68801C8.91675 5.38888 9.02326 5.13428 9.23627 4.92421C9.44928 4.71416 9.70535 4.60913 10.0045 4.60913C10.3036 4.60913 10.5582 4.71564 10.7683 4.92865C10.9783 5.14167 11.0834 5.39774 11.0834 5.69686C11.0834 5.99599 10.9769 6.25058 10.7639 6.46063C10.5508 6.6707 10.2948 6.77574 9.99564 6.77574Z" />
            </g>
          </svg>
        </div>
      </div>
    </>
  );
};

export default Comment;