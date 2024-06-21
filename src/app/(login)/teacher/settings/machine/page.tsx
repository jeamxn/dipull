import React from "react";

import { MachineConfig } from "@/app/api/machine/[type]/utils";
import { getStates } from "@/utils/getStates";
// import { getUserInfo } from "@/utils/server";

import TeacherMachinContent from "./TeacherMachinContent";

const TeacherWakeupListPage = async () => {
  // const initialUserInfo = await getUserInfo();
  const init: MachineConfig = await getStates("machine_time");
  const allowAllType = await getStates("machine_all_washer");
  const allowAllTime = await getStates("machine_all_time");
  return (
    <TeacherMachinContent
      init={init}
      initAllowAllTime={allowAllTime}
      initAllowAllType={allowAllType}
    />
  );
};

export default TeacherWakeupListPage;