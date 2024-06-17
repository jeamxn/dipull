import { cookies } from "next/headers";
import React from "react";

import { getWakeup } from "@/app/api/wakeup/server";
import { defaultUserData } from "@/app/auth/type";
import { verify } from "@/utils/jwt";

import ListContent from "./ListContent";

const MachinePage = async () => {
  const accessToken = cookies().get("accessToken")?.value || "";
  const verified = await verify(accessToken|| "");
  const initialUserInfo = verified.payload?.data || defaultUserData;
  const initialData = await getWakeup(initialUserInfo.id, initialUserInfo.gender);

  return (
    <ListContent
      initailData={{
        all: initialData.all,
        my: initialData.my,
        today: initialData.today,
        gender: initialData.gender as unknown as "male" | "female",
        week: initialData.week,
      }}
    />
  );
};

export default MachinePage;