import { ObjectId } from "mongodb";
import React from "react";

import { getBamboo } from "@/app/api/bamboo/server";
import { getTopBamboo } from "@/app/api/bamboo/top/[type]/get";
import { TokenInfo } from "@/app/auth/type";
import { getUserInfo } from "@/utils/server";

import BambooContent from "./BambooContent";

export type Data = {
  _id: ObjectId | string;
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

const Bamboo = async () => {
  const initialUserInfo = await getUserInfo();
  const topRes = await getTopBamboo("day", initialUserInfo.id!);
  const res = await getBamboo(initialUserInfo.id!, 0) as Data[];

  const initialData = res.map(v => ({
    ...v,
    _id: String(v._id),
  }));
  const initialTop = topRes.map(v => ({
    ...v,
    _id: String(v._id),
  }));

  return (
    <BambooContent initialData={initialData} initialTop={initialTop} userInfo={initialUserInfo} />
  );
};

export default Bamboo;
