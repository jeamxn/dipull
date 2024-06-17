import { cookies } from "next/headers";
import React from "react";

import { getJasupBook } from "@/app/api/jasup/book/get";
import { getMyJasup } from "@/app/api/jasup/my/post";
import { defaultUserData } from "@/app/auth/type";
import { verify } from "@/utils/jwt";

import JasupMyContent from "./JasupMyContent";

const Apply = async () => {
  const accessToken = cookies().get("accessToken")?.value || "";
  const verified = await verify(accessToken|| "");
  const initialUserInfo = verified.payload?.data || defaultUserData;

  const init = await getMyJasup(initialUserInfo.id, {});
  
  return (
    <JasupMyContent
      init={init}
    />
  );
};

export default Apply;