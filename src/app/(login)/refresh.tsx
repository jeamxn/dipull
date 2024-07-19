"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useSetRecoilState } from "recoil";

import instance from "@/utils/instance";
import { loadingAtom } from "@/utils/states";

import { UserData } from "../auth/type";

const Refresh = ({
  userInfo,
  ok,
}: {
  userInfo: UserData,
  ok: boolean
}) => { 
  const router = useRouter();
  const setLoading = useSetRecoilState(loadingAtom);
  const refresh = async () => { 
    if (!userInfo.id) {
      try {
        setLoading(true);
        await axios.get("/auth/refresh");
        router.refresh();
      }
      catch (e: any) {
        if(e.response.status === 401) {
          try {
            await instance.get("/auth/logout");
          }
          finally {
            document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            router.push("/login");
          }
        }
      }
      finally {
        setLoading(false);
      }
    }
  };
  React.useEffect(() => {
    refresh();
  }, []);
  return ok ? null : (
    <main className="flex min-h-screen flex-col items-center p-8">
      <p className="text-text/40 text-center">다시 로그인 중입니다…</p>
      <p className="text-text/40 text-center">이 화면에서 계속 머무를 경우 새로고침 해 주세요.</p>
    </main>
  );
};

export default Refresh;