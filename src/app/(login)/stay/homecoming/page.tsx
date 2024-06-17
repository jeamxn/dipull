import { cookies } from "next/headers";
import React from "react";

import { getHomecoming } from "@/app/api/homecoming/get";
import { goTime } from "@/app/api/homecoming/utils";
import { defaultUserData } from "@/app/auth/type";
import { verify } from "@/utils/jwt";

import HomecomingContent from "./HomecomingContent";

const Outing = async () => {
  const accessToken = cookies().get("accessToken")?.value || "";
  const verified = await verify(accessToken|| "");
  const initialUserInfo = verified.payload?.data || defaultUserData;

  const init = await getHomecoming(initialUserInfo.id);
  return (
    <HomecomingContent
      init={{
        myApply: init.reason,
        input: init.reason,
        goTimeI: goTime.indexOf(init.time),
      }}
    />
  );
};

export default Outing;