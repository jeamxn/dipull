import { cookies } from "next/headers";
import React from "react";

import { getStayApply } from "@/app/api/stay/get";
import { defaultUserData } from "@/app/auth/type";
import { verify } from "@/utils/jwt";

import StayContent from "./StayContent";

const Apply = async () => {
  const accessToken = cookies().get("accessToken")?.value || "";
  const verified = await verify(accessToken|| "");
  const initialUserInfo = verified.payload?.data || defaultUserData;

  const init = (await getStayApply(initialUserInfo.id)).data;
  return (
    <StayContent
      init={init}
      userInfo={initialUserInfo}
    />
  );
};

export default Apply;