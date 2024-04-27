import moment from "moment";
import React from "react";

const Message = ({
  isMyMessage,
  message,
  isSending = false,
  isRead = false,
  isStart = false,
  isEnd = false,
  time,
  isNewDay,
}: {
  isMyMessage: boolean;
  message: string;
  isSending?: boolean;
  isRead?: boolean;
  isStart?: boolean;
  isEnd?: boolean;
  time: string;
  isNewDay?: boolean;
}) => {
  const rounded_me = isStart ? "rounded-br-lg" : isEnd ? "rounded-tr-lg" : "rounded-r-lg";
  const rounded_you = isStart ? "rounded-bl-lg" : isEnd ? "rounded-tl-lg" : "rounded-l-lg";
  return (
    <>
      {
        isNewDay ? (
          <div className="w-full flex flex-row items-center justify-center gap-1 mb-2 mt-4">
            <p className="text-text/35 text-sm">{moment(time).format("YYYY-MM-DD")} ({["일","월","화","수","목","금","토"][moment(time).day()]})</p>
          </div>
        ) : null
      }
      {
        isMyMessage ? (
          <div className="w-full max-w-[100vw] flex flex-row items-end justify-end gap-1">
            <div className="flex flex-row items-end justify-end gap-1 mr-1">
              {
                !isRead && !isSending ? (
                  <>
                    <p className="text-text/35 text-sm">1</p>
                    <p className="text-text/35 text-sm">·</p>
                  </>
                ) : null
              }
              <p className="text-text/35 text-sm">{moment(time).format("HH:mm")}</p>
            </div>
            <p className={[
              "py-2 px-4 bg-primary text-white-light rounded-3xl max-w-[600px] break-all",
              rounded_me,
            ].join(" ")}>{message}</p>
            {
              isSending ? (
                <svg width="12" height="12" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path className="fill-text/35" d="M16.8 8.92497L1.4 15.425C1.06667 15.5583 0.75 15.5291 0.45 15.3375C0.15 15.1458 0 14.8666 0 14.5V1.49997C0 1.1333 0.15 0.854138 0.45 0.662471C0.75 0.470805 1.06667 0.441638 1.4 0.574971L16.8 7.07497C17.2167 7.2583 17.425 7.56664 17.425 7.99997C17.425 8.4333 17.2167 8.74164 16.8 8.92497ZM2 13L13.85 7.99997L2 2.99997V6.49997L8 7.99997L2 9.49997V13Z" />
                </svg>
              ) : null
            }
          </div>
        ) : (
          <div className="w-full max-w-[100vw] flex flex-row items-end justify-start gap-1">
            <p className={[
              "py-2 px-4 bg-text/5 dark:bg-text/10 rounded-3xl max-w-[600px] break-all",
              rounded_you,
            ].join(" ")}>{message}</p>
            <p className="text-text/35 text-sm ml-1">{moment(time).format("HH:mm")}</p>
          </div>
        )
      }
    </>
  );
};

export default Message;