import { Metadata, ResolvingMetadata } from "next";
import React from "react";

import Menu from "@/components/Navigation/menu";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "주말 신청 :: 디풀",
  };
}

const menus = [
  {
    url: "/stay/apply",
    name: "잔류",
  },
  {
    url: "/stay/outing",
    name: "외출",
  },
  {
    url: "/stay/homecoming",
    name: "금요귀가",
  }
];

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="py-6 flex flex-col gap-6">
      <Menu menus={menus} />
      {children}
    </div>
  );
};

export default Layout;