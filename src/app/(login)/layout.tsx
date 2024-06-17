import { cookies, headers } from "next/headers";
import React from "react";

import { refreshVerify, verify } from "@/utils/jwt";

import { defaultUserData } from "../auth/type";

import Footer from "./(header)/footer";
import Header from "./(header)/header";
import User from "./(header)/user";
import FireworkFrame from "./(joke)/fireworks";

const LoginedLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const accessToken = cookies().get("accessToken")?.value || "";
  const verified = await verify(accessToken|| "");
  const userInfo = verified.payload?.data || defaultUserData;

  return (
    <>
      <div 
        className="w-full h-[100vh] bg-background/50 backdrop-blur-xl fixed left-0 z-50" 
        style={{
          bottom: "calc(100vh - calc(env(safe-area-inset-top) * -1))",
        }}
      />
      {
        verified.ok ? (
          <>
            <Header userInfo={userInfo} />
            <User payload={userInfo} />
          </>
        ) : null
      }
      {children}
      <div className="absolute top-0 left-0 -z-[1]">
        <FireworkFrame />
      </div>
      <Footer />
    </>
  );
};

export default LoginedLayout;