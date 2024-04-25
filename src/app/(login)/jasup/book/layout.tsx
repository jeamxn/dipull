import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "자습 위치 :: 디풀",
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => children;

export default Layout;