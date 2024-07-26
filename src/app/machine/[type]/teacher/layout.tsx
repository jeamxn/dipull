import { Metadata } from "next";
import React from "react";

import { MachineType, machineTypeToKorean } from "@/app/machine/[type]/utils";

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
    title: `${params.type === "washer" ? "세탁기" : params.type === "dryer" ? "건조기": ""} 설정 :: 디풀`,
  };
}

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Props["params"];
}>) => children;

export default Layout;