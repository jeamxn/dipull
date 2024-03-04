"use client";

import Link from "next/link";
import React from "react";

const Menu = ({
  type,
  loading,
}: {
  type: "apply" | "outing";
  loading: boolean;
}) => {
  return (
    <section className="flex flex-col gap-3">
      <h1 className="text-xl font-semibold">유형 선택</h1>
      <section className={[
        "border border-text/10 bg-white p-5 rounded flex flex-row gap-3",
        loading ? "loading_background" : "",
      ].join(" ")}>
        <Link 
          className={[
            "text-base py-3 rounded w-full transition-colors text-center flex flex-row justify-center items-center",
            type === "apply" ? "bg-primary text-white" : "bg-white text-text/100 border border-text/10 hover:bg-text/10"
          ].join(" ")}
          href="/stay/apply"
          prefetch={true}
        >잔류 신청</Link>
        <Link 
          className={[
            "text-base py-3 rounded w-full transition-colors text-center flex flex-row justify-center items-center",
            type === "outing" ? "bg-primary text-white" : "bg-white text-text/100 border border-text/10 hover:bg-text/10"
          ].join(" ")}
          href="/stay/outing"
          prefetch={true}
        >외출 신청</Link>
      </section>
    </section>
  );
};


export default Menu;