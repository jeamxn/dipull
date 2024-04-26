import React from "react";

import SubMenu from "@/components/submenu";
import Insider from "@/provider/insider";

import { menu } from "./route";

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <SubMenu menu={menu} />
      <Insider>
        {children}
      </Insider>
    </>
  );
};

export default Layout;