"use client";

import Image from "next/image";
import React from "react";

import Insider from "@/provider/insider";
import instance from "@/utils/instance";

import Menu from "../menu";

const Gallary = () => {
  const [loading, setLoading] = React.useState(false);
  const get = async () => {
    setLoading(true);
    try {
      const { data } = await instance.get("/api/atheletic/instragram");
      console.log(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    get();
  }, []);
  return (
    <>
      <Menu />
      <Insider>
      </Insider>
    </>
  );
};


export default Gallary;