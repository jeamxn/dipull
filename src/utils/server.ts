"use server";

import { headers } from "next/headers";

import { defaultUser, UserInfo } from "./db/utils";
import { refreshVerify } from "./jwt";

export const getServerUser = async (): Promise<UserInfo> => {
  let user: UserInfo = defaultUser;
  try {
    const authorization = headers().get("cookie");
    const refreshToken = authorization?.split("refresh_token=")[1].split(";")[0] || "";
    const { id, email, gender, name, number, type, profile_image } = await refreshVerify(refreshToken);
    user = { id, email, gender, name, number, type, profile_image };
  } catch {
    user = defaultUser;
  }
  return user;
};