import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "학생 신청 수정 :: 디풀",
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => children;

export default Layout;