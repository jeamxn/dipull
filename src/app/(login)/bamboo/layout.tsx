import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "대나무 숲 :: 디미고인 풀 서비스 V3",
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => children;

export default Layout;