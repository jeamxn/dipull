"use client";

import React from "react";

import Insider from "@/provider/insider";

import Menu from "../menu";

import HomecomingSheet from "./homecomingSheet";
import StaySheet from "./staySheet";

const Admin = () => {
  const [loading, setLoading] = React.useState(false);

  return (
    <>
      <Menu />
      <Insider>
        <StaySheet 
          loading={loading}
          setLoading={setLoading}
        />
        <HomecomingSheet 
          loading={loading}
          setLoading={setLoading}
        />
      </Insider>
    </>
  );
};

export default Admin;