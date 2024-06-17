import moment from "moment";
import { cookies } from "next/headers";
import React from "react";

import { getOuting } from "@/app/api/outing/get";
import { defaultUserData } from "@/app/auth/type";
import { verify } from "@/utils/jwt";

import OutingContent from "./OutingContent";

const Outing = async () => {
  const accessToken = cookies().get("accessToken")?.value || "";
  const verified = await verify(accessToken|| "");
  const initialUserInfo = verified.payload?.data || defaultUserData;
  const init = await getOuting(initialUserInfo.id);
  return (
    <OutingContent
      init={init}
    />
  );
};

export default Outing;