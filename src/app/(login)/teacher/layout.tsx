import { Metadata } from "next";
import React from "react";

import Insider from "@/provider/insider";

export const metadata: Metadata = {
  title: "관리 페이지 :: 디풀",
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      {/* <SubMenu menu={menu} /> */}
      <Insider>
        {children}
      </Insider>
    </>
  );
};
export default Layout;