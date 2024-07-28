import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

import Menu from "@/components/Navigation/menu";
import { getServerUser } from "@/utils/server";

import { machine_menus, machine_teacher_menus, MachineType, machineTypeToKorean } from "./utils";

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

const Layout = async ({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Props["params"];
}>) => {
  if (!machineTypeToKorean(params.type)) return redirect("/machine/washer");

  const { type } = await getServerUser();
  const newMenus = type === "teacher" ? [...machine_menus, ...machine_teacher_menus] : machine_menus;

  return (
    <div className="py-6 flex flex-col gap-6 overflow-x-hidden">
      <Menu menus={newMenus} />
      {children}
    </div>
  );
};

export default Layout;