import React from "react";

import { getHosil } from "@/app/api/hosil/server";
import Error from "@/app/not-found";
import { getUserInfo } from "@/utils/server";

import HosilContent from "./HosilContent";

const HosilPage = async () => {
  const initialUserInfo = await getUserInfo();
  const init = await getHosil();
  
  if (initialUserInfo.number < 3000 || initialUserInfo.gender != "male") return <Error />;

  return (
    <HosilContent
      init={init}
      userInfo={initialUserInfo}
    />
  );
};

export default HosilPage;