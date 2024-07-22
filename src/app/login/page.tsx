"use client";

import { useRouter } from "next/navigation";
import React from "react";

import Promotion from "./Promotion";

function Home() {
  const router = useRouter();
  const login = async () => {
    const url = `${process.env.NEXT_PUBLIC_DIMIGOIN_URI}/oauth?client=${process.env.NEXT_PUBLIC_DIMIGOIN_KEY}&redirect=${window.location.origin}/auth`;
    router.push(url);
  };

  return (
    <div className="flex flex-col gap-6 items-start justify-center h-full px-10">
      <Promotion login={login} />
    </div>
  );
}

export default Home;