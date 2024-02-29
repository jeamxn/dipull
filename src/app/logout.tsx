"use client";

import { useRouter } from "next/navigation";
import React from "react";

import instance from "@/utils/instance";

const Logout = () => {
  const router = useRouter();
  
  const logout = async () => {
    const res = await instance.get("/auth/logout");
    router.push("/login");
  };
  const fetch = async () => {
    const res = await instance.get("/api");
    alert(res.data.message);
  };
  return (
    <div className="flex flex-row gap-1">
      <button onClick={logout} className="text-sm text-text/40 hover:text-primary transition-colors">로그아웃</button>
      <button onClick={fetch} className="text-sm text-text/40 hover:text-primary transition-colors">fetch</button>
    </div>
  );
};

export default Logout;