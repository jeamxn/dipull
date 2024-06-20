import { Metadata } from "next";
import React from "react";

import Insider from "@/provider/insider";

export const metadata: Metadata = {
  title: "학생 신청 수정 :: 디풀",
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <Insider>
      {children}
    </Insider>
  );
};

export default Layout;