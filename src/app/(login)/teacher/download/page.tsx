import React from "react";

import { getStayWhere } from "@/app/api/teacher/stay/where/server";

import Classstay from "./classstay";
import GotoClass from "./gotoClass";
import HomecomingSheet from "./homecomingSheet";
import StaySheet from "./staySheet";

const Admin = async () => {
  const init = await getStayWhere();

  return (
    <>
      <StaySheet />
      <HomecomingSheet />
      <Classstay init={init} />
      <GotoClass />
    </>
  );
};

export default Admin;