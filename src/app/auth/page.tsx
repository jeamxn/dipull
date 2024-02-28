"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const Auth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const login = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_REDIRECT_URI}/auth/login?token=${token}`);
    localStorage.setItem("accessToken", res.data.accessToken);
    router.replace("/");
  };

  React.useEffect(() => {
    if(!token) router.replace("/login");
    login();
  }, [token]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      로그인 중...
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