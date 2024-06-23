import { Metadata, ResolvingMetadata } from "next";
import React from "react";

type Props = {
  params: { 
    type: "washer" | "dryer";
  }
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  
  return {
    title: `${params.type === "washer" ? "세탁기" : "건조기"} 신청 :: 디풀`,
  };
}

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => children;

export default Layout;