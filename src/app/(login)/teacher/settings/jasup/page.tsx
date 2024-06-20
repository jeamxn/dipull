import React from "react";

import { getTeacherJasup } from "@/app/api/teacher/jasup/server";
import { getUserInfo } from "@/utils/server";

import TeacherJasupContent from "./TeacherJasupContent";

const TeacherWakeupListPage = async () => {
  const initialUserInfo = await getUserInfo();
  const init = (await getTeacherJasup(initialUserInfo.id)).data || [];

  return (
    <TeacherJasupContent init={init} />
  );
};

export default TeacherWakeupListPage;