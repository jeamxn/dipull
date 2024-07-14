"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useSetRecoilState } from "recoil";

import { alert } from "@/utils/alert";
import { loadingAtom } from "@/utils/states";

const Auth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const setLoading = useSetRecoilState(loadingAtom);

  const login = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/auth/login?token=${token}`);
      localStorage.setItem("accessToken", res.data.accessToken);
      setLoading(false);
      router.replace("/");
    }
    catch {
      alert.info("로그인에 실패했습니다.");
      setLoading(false);
      router.replace("/login");
    }
  };

  React.useEffect(() => {
    if(!token) router.replace("/login");
    login();
  }, [token]);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <p className="text-text/40 text-center">로그인 중입니다… 잠시 후 메인 화면으로 돌아갑니다.</p>
      <p className="text-text/40 text-center">이 화면에서 계속 머무를 경우 새로고침 해 주세요.</p>
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