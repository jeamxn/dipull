"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";

import instance from "@/utils/instance";

import { UserData } from "../auth/type";

const Refresh = ({
  userInfo,
  ok,
}: {
  userInfo: UserData,
  ok: boolean
}) => { 
  const router = useRouter();
  const refresh = async () => { 
    if (!userInfo.id) {
      try{
        await axios.get("/auth/refresh");
        router.refresh();
      }
      catch (e: any) {
        if(e.response.status === 401) {
          try {
            await instance.get("/auth/logout");
          }
          finally {
            router.push("/login");
          }
        }
      }
    }
  };
  React.useEffect(() => {
    refresh();
  }, []);
  return ok ? null : (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <span className="loader"></span>
    </main>
  );
};

export default Refresh;