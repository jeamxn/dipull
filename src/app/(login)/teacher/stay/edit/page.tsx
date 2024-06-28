import React from "react";

import { getUserInfo } from "@/utils/server";

import Edit from "./edit";
import HomecomingSheet from "./homecomingSheet";
import StaySheet from "./staySheet";

const Setting = async () => {
  const userInfo = await getUserInfo();

  return (
    <>
      <Edit userInfo={userInfo} />
      <StaySheet />
      <HomecomingSheet />
    </>
  );
};

export default Setting;