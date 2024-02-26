"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();
  const login = async () => {
    const url = `${process.env.NEXT_PUBLIC_DIMIGOIN_URI}/auth?client=65d1ee362893e7ba99634e12&redirect=${process.env.NEXT_PUBLIC_REDIRECT_URI}/auth`;
    router.push(url);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={login}>login</button>      
    </main>
  );
}
