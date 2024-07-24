import Cookies from "js-cookie";

import { defaultUser, UserInfo } from "./db/utils";

export const getUserInfo = () => {
  const user: UserInfo = JSON.parse(Cookies.get("user") || JSON.stringify(defaultUser));
  return user;
};
