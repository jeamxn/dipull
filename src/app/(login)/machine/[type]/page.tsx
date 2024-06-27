import React from "react";

import { getMachineData } from "@/app/api/machine/[type]/server";
import { getUserInfo } from "@/utils/server";

import MachineContent from "./MachineContent";

const MachinePage = async ({ params }: { params: { type: "washer" | "dryer" } }) => {
  const initialUserInfo = await getUserInfo();
  const res = await getMachineData(params.type, initialUserInfo.id || "");
  const initialData = res.defaultData;
  const initialBooking = res.myBookData;
  const initialLate = res.lateData;

  return (
    <MachineContent
      params={params}
      initialData={initialData}
      initialBooking={initialBooking}
      initialUserInfo={initialUserInfo}
      lateData={initialLate}
    />
  );
};


export default MachinePage;