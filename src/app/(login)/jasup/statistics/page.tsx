import React from "react";

import { getAllJasup } from "@/app/api/jasup/all/server";
import { getUserInfo } from "@/utils/server";

import JasupStatisticsContent from "./JasupStatisticsContent";

const Apply = async () => {
  const initialUserInfo = await getUserInfo();
  const init = await getAllJasup(initialUserInfo.id, initialUserInfo.number, {
    gradeClass: Math.floor(initialUserInfo.number / 100),
    isStay: false,
  });
  
  return (
    <JasupStatisticsContent
      init={init.data!}
    />
  );
};

export default Apply;