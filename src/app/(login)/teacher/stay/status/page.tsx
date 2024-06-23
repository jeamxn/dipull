import React from "react";

import StayContent from "@/app/(login)/stay/apply/StayContent";
import { getStayApply } from "@/app/api/stay/server";
import { getUserInfo } from "@/utils/server";

const Setting = async () => {
  const initialUserInfo = await getUserInfo();
  const init = (await getStayApply(initialUserInfo.id)).data;
  return (
    <StayContent
      init={init}
      userInfo={initialUserInfo}
      onlyView
    />
  );
};

export default Setting;