import React from "react";

import Edit from "./edit";
import HomecomingSheet from "./homecomingSheet";
import StaySheet from "./staySheet";

const Setting = async () => {
  return (
    <>
      <Edit />
      <StaySheet />
      <HomecomingSheet />
    </>
  );
};

export default Setting;