import React from "react";

import { defaultUser, UserInfo } from "@/utils/db/utils";

export const UserContext = React.createContext(defaultUser);

const UserProvider = ({ 
  children,
  userInfo
}: Readonly<{
  children: React.ReactNode;
  userInfo: UserInfo;
}>) => {
  return (
    <UserContext.Provider value={userInfo}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;