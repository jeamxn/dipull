"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

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
        className="text-sm text-text/40 hover:text-primary transition-colors"
        href={process.env.NEXT_PUBLIC_DIMIGOIN_URI || ""}
        target="_blank"
      >내 정보 수정</Link>
      <p className="text-sm text-text/40">·</p>
      <button onClick={logout} className="text-sm text-text/40 hover:text-primary transition-colors">로그아웃</button>
    </div>
  );
};

export default Logout;