import React from "react";

import { getMachineData } from "@/app/api/machine/[type]/server";
import { getUserInfo } from "@/utils/server";

import TeacherMachinContent from "./TeacherMachinContent";

const MachinePage = async ({ params }: { params: { type: "washer" | "dryer" } }) => {
  const initialUserInfo = await getUserInfo();
  const res = await getMachineData(params.type, initialUserInfo.id || "", true);
  const initialData = res.defaultData;
  const initialBooking = res.myBookData;
  const initialLate = res.lateData;

  return (
    <TeacherMachinContent
      params={params}
      initialData={initialData}
      initialBooking={initialBooking}
      initialUserInfo={initialUserInfo}
      lateData={initialLate}
    />
  );
};


export default MachinePage;