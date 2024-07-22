"use client";

import React from "react";
import { RecoilRoot } from "recoil";

const RecoilProvider = ({ 
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <RecoilRoot>
      {children}
    </RecoilRoot>
  );
};

export default RecoilProvider;