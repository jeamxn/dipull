import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "체육대회 갤러리 :: 디풀",
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => children;

export default Layout;