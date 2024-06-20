import React from "react";

import { getStayApply } from "@/app/api/stay/server";
import { getStayWhere } from "@/app/api/teacher/stay/where/server";
import { getUserInfo } from "@/utils/server";

import Common from "./common";

const TeacherWakeupListPage = async () => {
  const initialUserInfo = await getUserInfo();
  const initStayInfo = (await getStayApply(initialUserInfo.id)).data;
  const classstayInit = await getStayWhere();

  return (
    <Common
      initStayInfo={initStayInfo}
      initialUserInfo={initialUserInfo}
      classstayInit={classstayInit}
    />
  );
};

export default TeacherWakeupListPage;