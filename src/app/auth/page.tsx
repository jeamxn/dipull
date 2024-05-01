"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

import { alert } from "@/utils/alert";

const Auth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const login = async () => {
    try{
      const res = await axios.get(`${process.env.NEXT_PUBLIC_APP_URI}/auth/login?token=${token}`);
      localStorage.setItem("accessToken", res.data.accessToken);
      router.replace("/");
    }
    catch {
      alert.info("로그인에 실패했습니다.");
      router.replace("/login");
    }
  };

  React.useEffect(() => {
    if(!token) router.replace("/login");
    login();
  }, [token]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <span className="loader"></span>
    </main>
  );
};

const ExportAuth = () => {
  return (
    <React.Suspense>
      <Auth />
    </React.Suspense>
  );
};

export default ExportAuth;