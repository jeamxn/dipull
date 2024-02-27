"use client";

import * as jose from "jose";
import { useRouter } from "next/navigation";
import React from "react";

import Insider from "@/provider/insider";
import instance from "@/utils/instance";

const Home = () => {
  // const decrypt = jose.decodeJwt(localStorage.getItem("accessToken")!);
  const router = useRouter();

  const fetch = async () => {
    const res = await instance.get("/api");
    console.log(res.data);
  };
  const logout = async () => {
    const res = await instance.get("/auth/logout");
    router.push("/login");
    console.log(res.data);
  };
  return (
    <Insider>
      {/* {JSON.stringify(decrypt)} */}
      <button onClick={fetch}>fetch</button>
      <button onClick={logout}>logout</button>
    </Insider>
  );
};


export default Home;