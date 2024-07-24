import React from "react";

import { getUserInfo } from "@/utils/cookies";
import { defaultUser } from "@/utils/db/utils";

const useUserInfo = () => { 
  const [user, setUser] = React.useState(defaultUser);
  React.useEffect(() => {
    setUser(getUserInfo());
  }, []); 
  return user;
};

export default useUserInfo;