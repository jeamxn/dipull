import React from "react";

import { getWakeupAvail } from "@/app/api/wakeup/apply/server";
import { getWakeup } from "@/app/api/wakeup/server";
import { getUserInfo } from "@/utils/server";

import Content from "./content";
import MyAvailContent from "./MyAvailContent";
import MyListContent from "./MyListContent";

const MachinePage = async () => {
  const initialUserInfo = await getUserInfo();
  const initialData = await getWakeup(initialUserInfo.id, initialUserInfo.gender);
  const initailAvail = await getWakeupAvail(initialUserInfo.id);
  return (
    <Content myAvail={initailAvail.available} initailData={initialData} />
  );
};

export default MachinePage;