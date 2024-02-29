"use client";

import React from "react";

import { UserInfo, defaultUserData } from "@/app/api/admin/userinfo/utils";
import Insider from "@/provider/insider";

import Outing from "./outing";
import Search from "./search";
import Stay from "./stay";

const Admin = () => {
  const [loading, setLoading] = React.useState(false);
  const [component, setComponent] = React.useState<"stay" | "outing" | "">("");
  const [selectedUser, setSelectedUser] = React.useState<UserInfo>(defaultUserData);

  return (
    <Insider className="flex flex-col gap-5">
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
    </Insider>
  );
};

export default Admin;