import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "로그인 :: 디풀",
  };
}

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      {children}
    </main>
  );
};

export default Layout;