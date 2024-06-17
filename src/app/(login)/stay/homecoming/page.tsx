import React from "react";

import { getHomecoming } from "@/app/api/homecoming/server";
import { goTime } from "@/app/api/homecoming/utils";
import { getUserInfo } from "@/utils/server";

import HomecomingContent from "./HomecomingContent";

const Outing = async () => {
  const initialUserInfo = await getUserInfo();
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