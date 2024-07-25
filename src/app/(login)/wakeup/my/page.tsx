import React from "react";

import MyListContent from "@/app/(login)/wakeup/my/MyListContent.tsx";
import { getWakeup } from "@/app/api/wakeup/server";
import { getUserInfo } from "@/utils/server";


const MachinePage = async () => {
  const initialUserInfo = await getUserInfo();
  const initialData = await getWakeup(initialUserInfo.id, initialUserInfo.gender);

  return (
    <>
      <MyListContent initailData={initialData} />
    </>
  );
};

export default MachinePage;