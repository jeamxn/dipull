import { cookies } from "next/headers";
import React from "react";

import { getJasupBook } from "@/app/api/jasup/book/get";
import { defaultUserData } from "@/app/auth/type";
import { verify } from "@/utils/jwt";

import JasupBookContent from "./JasupBookContent";

const Apply = async () => {
  const accessToken = cookies().get("accessToken")?.value || "";
  const verified = await verify(accessToken|| "");
  const initialUserInfo = verified.payload?.data || defaultUserData;

  const init = (await getJasupBook(initialUserInfo.id)).reverse();
  return (
    <JasupBookContent
      init={init}
    />
  );
};

export default Apply;