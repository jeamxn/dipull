"use client";

import React from "react";

import { UserInfo, defaultUserData } from "@/app/api/teacher/userinfo/utils";
import Insider from "@/provider/insider";

import Menu from "../menu";

import Wakeup from "./wakeup";

const Admin = () => {
  const [loading, setLoading] = React.useState(false);

  return (
    <>
      <Menu />
      <Insider>
        <Wakeup
          loading={loading}
          setLoading={setLoading}
        />
      </Insider>
    </>
  );
};

export default Admin;