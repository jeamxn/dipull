import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

import Menu from "@/components/Navigation/menu";

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

const menus = [
  {
    name: "세탁기",
    url: "/machine/washer",
  },
  {
    name: "건조기",
    url: "/machine/dryer",
  },
];

const Layout = ({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Props["params"];
}>) => {
  if (!machineTypeToKorean(params.type)) return redirect("/machine/washer");
  return (
    <div className="py-6 flex flex-col gap-6">
      <Menu menus={menus} />
      {children}
    </div>
  );
};

export default Layout;