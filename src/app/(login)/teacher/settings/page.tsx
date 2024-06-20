import React from "react";

import { getStayWhere } from "@/app/api/teacher/stay/where/server";

import Classstay from "./classstay";
import GotoClass from "./gotoClass";
import Jasup from "./jasup";

const Admin = async () => {
  const classstayInit = await getStayWhere();

  return (
    <>
      <Jasup />
      <Classstay init={classstayInit} />
      <GotoClass />
    </>
  );
};

export default Admin;