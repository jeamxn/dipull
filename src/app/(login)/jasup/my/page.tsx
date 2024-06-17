import React from "react";

import { getMyJasup } from "@/app/api/jasup/my/server";
import { getUserInfo } from "@/utils/server";

import JasupMyContent from "./JasupMyContent";

const Apply = async () => {
  const initialUserInfo = await getUserInfo();
  const init = await getMyJasup(initialUserInfo.id, {});
  
  return (
    <JasupMyContent
      init={init}
    />
  );
};

export default Apply;