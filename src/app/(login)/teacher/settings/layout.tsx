import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Excel 다운로드 :: 디풀",
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => children;

export default Layout;