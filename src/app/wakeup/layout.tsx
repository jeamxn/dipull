import { Metadata, ResolvingMetadata } from "next";
import React from "react";

import Menu from "./menu";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "기상송 신청 :: 디풀",
  };
}

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="py-6 flex flex-col gap-6">
      <Menu />
      {children}
    </div>
  );
};

export default Layout;