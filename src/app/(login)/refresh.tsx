"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";

import instance from "@/utils/instance";

import { UserData } from "../auth/type";

const Refresh = ({
  userInfo,
}: {
  userInfo: UserData,
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
  return null;
};

export default Refresh;