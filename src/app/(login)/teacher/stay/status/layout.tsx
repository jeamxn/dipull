import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "잔류 신청 현황 :: 디풀",
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => children;

export default Layout;