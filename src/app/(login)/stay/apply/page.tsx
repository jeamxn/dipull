import React from "react";

import { getStayApply } from "@/app/api/stay/server";
import { getUserInfo } from "@/utils/server";

import StayContent from "./StayContent";

const Apply = async () => {
  const initialUserInfo = await getUserInfo();
  const init = (await getStayApply(initialUserInfo.id)).data;
  return (
    <StayContent
      init={init}
      userInfo={initialUserInfo}
    />
  );
};

export default Apply;