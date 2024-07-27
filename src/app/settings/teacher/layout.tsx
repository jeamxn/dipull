import { Metadata } from "next";
import React from "react";

import Menu from "@/components/Navigation/menu";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "설정 :: 디풀",
  };
}

const menus = [
  {
    name: "열람실 좌석 설정하기",
    url: "/settings/teacher/studyroom",
  },
  {
    name: "교실로 보내기",
    url: "/settings/teacher/where",
  },
];

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="py-6 flex flex-col gap-6 overflow-hidden">
      <Menu menus={menus} />
      {children}
    </div>
  );
};

export default Layout;