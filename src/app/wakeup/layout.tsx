import { Metadata, ResolvingMetadata } from "next";
import React from "react";

import Menu from "@/components/Navigation/menu";
import { getServerUser } from "@/utils/server";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "기상송 신청 :: 디풀",
  };
}

const menus = [
  {
    url: "/wakeup/list",
    name: "목록",
  },
  {
    url: "/wakeup/search",
    name: "검색하기",
  },
  {
    url: "/wakeup/my",
    name: "내 신청",
  }
];

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { type } = await getServerUser();
  return (
    <div className="py-6 flex flex-col gap-6">
      { type === "teacher" ? null : <Menu menus={menus} /> }
      {children}
    </div>
  );
};

export default Layout;