"use client";

import React from "react";

import { UserInfo, defaultUserData } from "@/app/api/teacher/userinfo/utils";
import Insider from "@/provider/insider";

import Outing from "./outing";
import Search from "./search";
import Sheet from "./sheet";
import Stay from "./stay";
import Wakeup from "./wakeup";

const Admin = () => {
  const [loading, setLoading] = React.useState(false);
  const [component, setComponent] = React.useState<"stay" | "outing" | "">("");
  const [selectedUser, setSelectedUser] = React.useState<UserInfo>(defaultUserData);

  return (
    <Insider>
      <Sheet 
        loading={loading}
        setLoading={setLoading}
      />
      <Search 
        loading={loading}
        setLoading={setLoading}
        component={component}
        setComponent={setComponent}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
      {
        selectedUser.id ? 
          component === "stay" ? (
            <Stay
              loading={loading}
              setLoading={setLoading}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          ) : component === "outing" ? ( 
            <Outing 
              loading={loading}
              setLoading={setLoading}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          ) : null : null
      }
      <Wakeup
        loading={loading}
        setLoading={setLoading}
      />
    </Insider>
  );
};

export default Admin;