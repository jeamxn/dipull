"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React from "react";

import NotificationIcon from "./notificationIcon";

const NotificationInner = dynamic(() => import("./notificationInner"), { ssr: false });

const Notification = ({
  init
}: {
    init: string[];
}) => {
  const router = useRouter();
  const [isClicked, setIsClicked] = React.useState(false);
  const [isRead, setIsRead] = React.useState(true);

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
      <NotificationInner
        init={init}
        isClicked={isClicked}
        setIsClicked={setIsClicked}
        isRead={isRead}
        setIsRead={setIsRead}
      />
    </>
  );
};

export default Notification;