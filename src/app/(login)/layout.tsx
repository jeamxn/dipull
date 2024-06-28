import React from "react";

import { getUserAndVerify } from "@/utils/server";

import Footer from "./(header)/footer";
import Header from "./(header)/header";
import User from "./(header)/user";
import FireworkFrame from "./(joke)/fireworks";
import Refresh from "./refresh";

const LoginedLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { verified, userInfo } = await getUserAndVerify();
  return verified.ok ? (
    <>
      <div 
        className="w-full h-[100vh] bg-background/50 backdrop-blur-xl fixed left-0 z-50" 
        style={{
          bottom: "calc(100vh - calc(env(safe-area-inset-top) * -1))",
        }}
      />
      <Header userInfo={userInfo} />
      <User payload={userInfo} />
      {children}
      <div className="absolute top-0 left-0 -z-[1]">
        <FireworkFrame />
      </div>
      <Footer />
      <Refresh userInfo={userInfo} />
    </>
  ) : (
    <Refresh userInfo={userInfo} />
  );
};

export default LoginedLayout;