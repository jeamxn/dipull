import dynamic from "next/dynamic";
import React from "react";

import { getReject } from "@/app/api/push/reject/server";
import { getUserInfo } from "@/utils/server";

import NotificationInner from "./notificationInner";

const NotificationPage = async () => {
  const userInfo = await getUserInfo();
  const notificationInit = await getReject(userInfo.id);

  return (
    <NotificationInner init={notificationInit} />
  );
};


export default NotificationPage;