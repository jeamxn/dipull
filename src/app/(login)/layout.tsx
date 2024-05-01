import { headers } from "next/headers";
import React from "react";

import { refreshVerify } from "@/utils/jwt";

import Footer from "./(header)/footer";
import Header from "./(header)/header";
import User from "./(header)/user";
import FireworkFrame from "./(joke)/fireworks";

const LoginedLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookie = headers().get("cookie")?.replaceAll(" ", "").split(";").map((c: string) => {
    const [key, value] = c.split("=");
    return {
      key: key,
      value: value,
    };
  }) || [];
  const cookieJSON = Object.fromEntries(cookie.map((c: any) => [c.key, c.value]));
  const { refreshToken } = cookieJSON;
  const veryfied = await refreshVerify(refreshToken);

  return (
    <>
      <div 
        className="w-full h-[100vh] bg-background/50 backdrop-blur-xl fixed left-0 z-50" 
        style={{
          bottom: "calc(100vh - calc(env(safe-area-inset-top) * -1))",
        }}
      />
      <Header veryfied={veryfied} />
      {
        veryfied.ok ? <User payload={veryfied.payload} /> : null
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