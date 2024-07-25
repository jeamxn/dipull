import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "대나무 숲 :: 디풀",
  };
};

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return children;
};

export default Layout;