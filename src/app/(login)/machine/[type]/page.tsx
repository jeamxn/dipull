import { cookies } from "next/headers";
import React from "react";

import { getMachineData } from "@/app/api/machine/[type]/get";
import { defaultUserData } from "@/app/auth/type";
import { verify } from "@/utils/jwt";

import MachineContent from "./MachineContent";

const MachinePage = async ({ params }: { params: { type: "washer" | "dryer" } }) => {
  const accessToken = cookies().get("accessToken")?.value || "";
  const verified = await verify(accessToken|| "");
  
  const initialUserInfo = verified.payload?.data || defaultUserData;

  const res = await getMachineData(params.type, verified.payload?.id || "");
  const initialData = res.defaultData;
  const initialBooking = res.myBookData;

  return (
    <MachineContent
      params={params}
      initialData={initialData}
      initialBooking={initialBooking}
      initialUserInfo={initialUserInfo}
    />
  );
};


export default MachinePage;