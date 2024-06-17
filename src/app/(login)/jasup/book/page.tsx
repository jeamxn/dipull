import React from "react";

import { getJasupBook } from "@/app/api/jasup/book/server";
import { getUserInfo } from "@/utils/server";

import JasupBookContent from "./JasupBookContent";

const Apply = async () => {
  const initialUserInfo = await getUserInfo();
  const init = (await getJasupBook(initialUserInfo.id)).reverse();
  return (
    <JasupBookContent
      init={init}
    />
  );
};

export default Apply;