import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "다이랙트 메시지 :: 디풀",
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => children;

export default Layout;