"use server";

import { cookies } from "next/headers";

import { defaultUserData } from "@/app/auth/type";

import { verify } from "./jwt";

export const getUserVeryfied = async () => { 
  const accessToken = cookies().get("accessToken")?.value || "";
  const verified = await verify(accessToken || "");
  return verified;
};

export const getUserInfo = async () => { 
  const verified = await getUserVeryfied();
  const userInfo = verified.payload?.data || defaultUserData;
  return userInfo;
};

export const getUserAndVerify = async () => { 
  const verified = await getUserVeryfied();
  const userInfo = await getUserInfo();
  return { verified, userInfo };
};