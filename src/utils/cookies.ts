import Cookies from "js-cookie";
import React from "react";

import { defaultUser, UserInfo } from "./db/utils";

export const getUserInfo = () => {
  const user: UserInfo = JSON.parse(Cookies.get("user") || JSON.stringify(defaultUser));
  return user;
};

export const useUserInfo = () => { 
  const [user, setUser] = React.useState(defaultUser);
  React.useEffect(() => {
    setUser(getUserInfo());
  }, []); 
  return user;
};