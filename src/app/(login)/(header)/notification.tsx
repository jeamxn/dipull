"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

import Linker from "@/components/Linker";
import instance from "@/utils/instance";

import NotificationIcon from "./notificationIcon";

const Notification = () => {
  const [isRead, setIsRead] = React.useState(true);
  const pathname = usePathname();

  React.useEffect(() => {
    async function setupPushNotifications() {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          const registration = await navigator.serviceWorker.register("/service-worker.js");
          console.log("Service Worker 등록 성공:", registration.scope);
          const existingSubscription = await registration.pushManager.getSubscription();
          if (existingSubscription) {
            await existingSubscription.unsubscribe();
            console.log("기존 구독 해제됨");
          }
          const response = await instance.get("/api/push/vapid");
          const { publicKey }: { publicKey: string } = response.data;

          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: publicKey
          });
          await instance.post("/api/push/subscribe", subscription);
          await instance.post("/api/push/subscribe", subscription);
          console.log("새 구독 완료");
        } catch (err) {
          console.error("Push 알림 설정 실패:", err);
        }
      }
    }

    setupPushNotifications();
  }, []);

  return (
    <>
      <Linker
        className="px-3 py-2 my-2 text-sm rounded hover:bg-text/15 cursor-pointer notification-icon"
        href="/settings/notification"
        onClick={() => setIsRead(true)}
      >
        <NotificationIcon isClicked={pathname === "/settings/notification"} isRead={isRead} />
      </Linker>
    </>
  );
};

export default Notification;