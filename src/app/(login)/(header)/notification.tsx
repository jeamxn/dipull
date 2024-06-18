"use client";

import moment from "moment";
import React from "react";
import { useRecoilState } from "recoil";

import { alert } from "@/utils/alert";
import { notificationsAtom } from "@/utils/states";

import NotificationIcon from "./notificationIcon";

const Notification = () => {
  const [isClicked, setIsClicked] = React.useState(false);
  const [isRead, setIsRead] = React.useState(true);
  const [isBlock, setIsBlock] = React.useState(false);
  const [notifications, setNotifications] = useRecoilState(notificationsAtom);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if(isClicked) {
      alert.nofitication({
        message: "알림을 허용했습니다.",
        options: {
          body: "알림을 허용했습니다.",
        },
        onGranted: false,
        noError: true,
      });
      setIsBlock(true);
    } else {
      // timer = setTimeout(() => {
      //   setIsBlock(false);
      // }, 300);
    }
    return () => clearTimeout(timer);
  }, [isClicked]);

  React.useEffect(() => {
    //다른 곳 눌렀을 때 isClicked를 false로 만들어야 함
    const handleClick = (e: MouseEvent) => {
      if(
        !(e.target as HTMLElement).closest(".notification-icon") 
        && !(e.target as HTMLElement).closest(".notification")
      ) {
        setIsClicked(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <div 
        className="px-3 py-2 my-2 text-sm rounded hover:bg-text/15 cursor-pointer notification-icon"
        onClick={() => {
          setIsClicked(p => !p);
          setIsRead(true);
        }}
      >
        <NotificationIcon isClicked={isClicked} isRead={isRead} />
      </div>
      <div 
        className={[
          "mt-safe bg-white absolute top-[3.6rem] right-0 z-50 notification w-[100vw] max-w-96 border border-text/10 rounded flex-col transition-opacity duration-300",
          "max-[520px]:rounded-none max-[520px]:top-[3.3rem] max-[520px]:max-w-[100vw] max-[520px]:fixed",
          isBlock ? "flex" : "hidden",
          isClicked ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        {
          notifications.length ? notifications.map((item, index) => {
            const diff = moment().diff(moment(item.date), "minutes");
            return (
              <div 
                className={[
                  "p-4 group/notification border-text/10 hover:bg-text/5 cursor-pointer flex flex-row justify-between items-center",
                  index === 0 ? "border-b-[.5px]" : index === notifications.length - 1 ? "border-t-[.5px]" : "border-y-[.5px]",
                ].join(" ")} 
                key={index}
                onClick={item.onclick || (() => {})}
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-text">{item.text}</p>
                  <p className="text-text/60 text-sm">
                    {
                      diff < 1 ? "방금 전" : 
                        diff < 60 ? `${diff}분 전` : 
                          diff < 1440 ? `${Math.floor(diff / 60)}시간 전` : 
                            diff < 10080 ? `${Math.floor(diff / 1440)}일 전` :
                              diff < 43800 ? `${Math.floor(diff / 10080)}주 전` :
                                diff < 525600 ? `${Math.floor(diff / 43800)}개월 전` :
                                  `${Math.floor(diff / 525600)}년 전`
                    }
                  </p>
                </div>
                <div 
                  className={[
                    "group/remove group-hover/notification:opacity-100 opacity-0 max-[520px]:opacity-100",
                    "h-10 w-10 p-2 flex flex-row items-center justify-center rounded-full hover:bg-text/15 transition-all cursor-pointer",
                  ].join(" ")}
                  onClick={() => {
                    setNotifications(notifications.filter((_, i) => i !== index));
                  }}
                >
                  <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className={[
                      "fill-text/40 transition-all",
                      // 부모가 hover되면
                      "group-hover/remove:fill-text",
                    ].join(" ")} d="M3.22119 14.9698C2.67119 14.9698 2.20036 14.774 1.80869 14.3823C1.41702 13.9907 1.22119 13.5198 1.22119 12.9698V3.96985C0.937858 3.96985 0.700358 3.87402 0.508691 3.68235C0.317025 3.49068 0.221191 3.25318 0.221191 2.96985C0.221191 2.68652 0.317025 2.44902 0.508691 2.25735C0.700358 2.06568 0.937858 1.96985 1.22119 1.96985H4.22119V1.46985C4.22119 1.18652 4.31702 0.949015 4.50869 0.757349C4.70036 0.565682 4.93786 0.469849 5.22119 0.469849H7.22119C7.50452 0.469849 7.74202 0.565682 7.93369 0.757349C8.12536 0.949015 8.22119 1.18652 8.22119 1.46985V1.96985H11.2212C11.5045 1.96985 11.742 2.06568 11.9337 2.25735C12.1254 2.44902 12.2212 2.68652 12.2212 2.96985C12.2212 3.25318 12.1254 3.49068 11.9337 3.68235C11.742 3.87402 11.5045 3.96985 11.2212 3.96985V12.9698C11.2212 13.5198 11.0254 13.9907 10.6337 14.3823C10.242 14.774 9.77119 14.9698 9.22119 14.9698H3.22119ZM14.2212 13.9698C13.9379 13.9698 13.7004 13.874 13.5087 13.6823C13.317 13.4907 13.2212 13.2532 13.2212 12.9698C13.2212 12.6865 13.317 12.449 13.5087 12.2573C13.7004 12.0657 13.9379 11.9698 14.2212 11.9698H16.2212C16.5045 11.9698 16.742 12.0657 16.9337 12.2573C17.1254 12.449 17.2212 12.6865 17.2212 12.9698C17.2212 13.2532 17.1254 13.4907 16.9337 13.6823C16.742 13.874 16.5045 13.9698 16.2212 13.9698H14.2212ZM14.2212 9.96985C13.9379 9.96985 13.7004 9.87402 13.5087 9.68235C13.317 9.49068 13.2212 9.25318 13.2212 8.96985C13.2212 8.68652 13.317 8.44902 13.5087 8.25735C13.7004 8.06568 13.9379 7.96985 14.2212 7.96985H18.2212C18.5045 7.96985 18.742 8.06568 18.9337 8.25735C19.1254 8.44902 19.2212 8.68652 19.2212 8.96985C19.2212 9.25318 19.1254 9.49068 18.9337 9.68235C18.742 9.87402 18.5045 9.96985 18.2212 9.96985H14.2212ZM14.2212 5.96985C13.9379 5.96985 13.7004 5.87402 13.5087 5.68235C13.317 5.49068 13.2212 5.25318 13.2212 4.96985C13.2212 4.68652 13.317 4.44902 13.5087 4.25735C13.7004 4.06568 13.9379 3.96985 14.2212 3.96985H19.2212C19.5045 3.96985 19.742 4.06568 19.9337 4.25735C20.1254 4.44902 20.2212 4.68652 20.2212 4.96985C20.2212 5.25318 20.1254 5.49068 19.9337 5.68235C19.742 5.87402 19.5045 5.96985 19.2212 5.96985H14.2212ZM3.22119 3.96985V12.9698H9.22119V3.96985H3.22119Z" />
                  </svg>
                </div>
              </div>
            );
          }) : (
            <p className="text-text/60 text-center p-4">알림이 없습니다.</p>
          )
        }
        <div 
          className="w-full px-2 py-1 border-t border-text/10 flex items-center justify-center"
          onClick={() => {
            setNotifications([]);
          }}
        >
          <p className="cursor-pointer px-6 py-2 hover:bg-text/15 rounded text-sm font-medium">모두 보관하기</p>
        </div>
      </div>
    </>
  );
};

export default Notification;