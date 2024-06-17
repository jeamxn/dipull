import React from "react";

import { getOuting } from "@/app/api/outing/server";
import { getUserInfo } from "@/utils/server";

import OutingContent from "./OutingContent";

const Outing = async () => {
  const initialUserInfo = await getUserInfo();
  const init = await getOuting(initialUserInfo.id);
  return (
    <OutingContent
      init={init}
    />
  );
};

export default Outing;