"use client";

import React from "react";

import { StayGetResponse } from "@/app/api/stay/utils";
import { UserInfo, defaultUserData } from "@/app/api/teacher/userinfo/utils";
import { UserData } from "@/app/auth/type";

import Homecoming from "./homecoming";
import Outing from "./outing";
import Search from "./search";
import Stay from "./stay";


const Edit = ({
  userInfo
}: {
  userInfo: UserData;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [component, setComponent] = React.useState<"stay" | "outing" | "homecoming" | "">("");
  const [selectedUser, setSelectedUser] = React.useState<UserInfo>(defaultUserData);

  const components = {
    "stay": <Stay
      userInfo={userInfo}
      loading={loading}
      setLoading={setLoading}
      selectedUser={selectedUser}
      setSelectedUser={setSelectedUser}
    />,
    "outing" : <Outing 
      loading={loading}
      setLoading={setLoading}
      selectedUser={selectedUser}
      setSelectedUser={setSelectedUser}
    />,
    "homecoming": <Homecoming 
      loading={loading}
      setLoading={setLoading}
      selectedUser={selectedUser}
      setSelectedUser={setSelectedUser}
    />,
    "": null,
  };

  return (
    <>
      <Search 
        loading={loading}
        setLoading={setLoading}
        component={component}
        setComponent={setComponent}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
      {
        selectedUser.id ? components[component] : null
      }
    </>
  );
};

export default Edit;