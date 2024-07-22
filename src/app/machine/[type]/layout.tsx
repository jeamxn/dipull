import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

import { MachineType, machineTypeToKorean } from "./utils";

type Props = {
  params: { 
    type: MachineType;
  }
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  if (!machineTypeToKorean(params.type)) return {};
  return {
    title: `${params.type === "washer" ? "세탁기" : params.type === "dryer" ? "건조기": ""} 신청 :: 디풀`,
  };
}

const Layout = ({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Props["params"];
}>) => {
  if (!machineTypeToKorean(params.type)) return redirect("/machine/washer");
  return children;
};

export default Layout;