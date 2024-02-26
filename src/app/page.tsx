"use client";

import { useRouter } from "next/navigation";
import React from "react";

import instance from "@/utils/instance";

export default function Home() {
  const router = useRouter();

  const fetch = async () => {
    const res = await instance.get("/api");
    console.log(res.data);
  };
  const logout = async () => {
    const res = await instance.get("/auth/logout");
    router.push("/login");
    console.log(res.data);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      asdf
      <button onClick={fetch}>fetch</button>
      <button onClick={logout}>logout</button>
    </main>
  );
}
