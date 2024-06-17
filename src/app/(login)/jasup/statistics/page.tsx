import { cookies } from "next/headers";
import React from "react";

import { getAllJasup } from "@/app/api/jasup/all/post";
import { getJasupBook } from "@/app/api/jasup/book/get";
import { getMyJasup } from "@/app/api/jasup/my/post";
import { defaultUserData } from "@/app/auth/type";
import { verify } from "@/utils/jwt";

import JasupStatisticsContent from "./JasupStatisticsContent";

const Apply = async () => {
  const accessToken = cookies().get("accessToken")?.value || "";
  const verified = await verify(accessToken|| "");
  const initialUserInfo = verified.payload?.data || defaultUserData;

  const init = await getAllJasup(initialUserInfo.id, initialUserInfo.number, {
    gradeClass: Math.floor(initialUserInfo.number / 100),
    isStay: false,
  });
  
  return (
    <JasupStatisticsContent
      init={init.data!}
    />
  );
};

export default Apply;