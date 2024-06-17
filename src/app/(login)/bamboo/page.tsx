import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import React from "react";

import { getBamboo } from "@/app/api/bamboo/post";
import { getTopBamboo } from "@/app/api/bamboo/top/[type]/get";
import { TokenInfo, defaultUserData } from "@/app/auth/type";
import { verify } from "@/utils/jwt";

import BambooContent from "./BambooContent";

export type Data = {
  _id: ObjectId;
  user: string;
  text: string;
  timestamp: string;
  number: number;
  isgood: boolean;
  isbad: boolean;
  good: number;
  bad: number;
  comment?: number;
};

export interface BambooProps {
  initialData: Data[];
  initialTop: Data[];
  userInfo: TokenInfo["data"];
}

async function fetchData() {
  const accessToken = cookies().get("accessToken")?.value || "";
  const verified = await verify(accessToken || "");
  
  const topRes = await getTopBamboo("day", verified.payload?.id!);
  const res = await getBamboo(verified.payload?.id!, 0) as Data[];

  return {
    initialData: res,
    initialTop: topRes,
    userInfo: verified.payload?.data || defaultUserData,
  };
}

const Bamboo = async () => {
  const { initialData, initialTop, userInfo } = await fetchData();

  return (
    <BambooContent initialData={initialData} initialTop={initialTop} userInfo={userInfo} />
  );
};

export default Bamboo;
