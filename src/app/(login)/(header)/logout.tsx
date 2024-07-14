"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import Mover from "@/components/Mover";
import instance from "@/utils/instance";

const Logout = () => {
  const router = useRouter();
  
  const logout = async () => {
    await instance.get("/auth/logout");
    router.push("/login");
  };

  return (
    <div className="flex flex-row gap-1">
      <Link 
        className="text-sm text-text/40 hover:text-primary transition-colors break-keep whitespace-nowrap"
        href={process.env.NEXT_PUBLIC_DIMIGOIN_URI || ""}
        target="_blank"
      >정보 수정</Link>
      <p className="text-sm text-text/40">·</p>
      <Mover
        onClick={logout}
        className="text-sm text-text/40 hover:text-primary transition-colors"
      >로그아웃</Mover>
    </div>
  );
};

export default Logout;