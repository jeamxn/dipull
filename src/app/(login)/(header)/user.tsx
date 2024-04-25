"use client";

/* eslint-disable @next/next/no-img-element */
import { usePathname } from "next/navigation";
import React from "react";

import { UserData } from "@/app/auth/type";

import Logout from "./logout";
import Qrcode from "./qrcode";

const User = ({
  payload
}: {
  payload: UserData
}) => {
  const pathname = usePathname();
  return pathname.split("/")[1] === "" ? (
    <article className="w-full py-4 px-4 border-b border-text/10 flex flex-row items-center justify-between gap-4">
      <div className="flex flex-row gap-4 items-center">
        <img src={payload.profile_image} alt={payload.name} width={60} height={60} className="rounded-full" />
        <figure className="flex flex-col justify-center items-start">
          <p className="font-semibold text-lg">{payload.number} {payload.name}</p>
          <Logout />
        </figure>
      </div>
      <Qrcode number={payload.number} />
    </article>
  ) : null;
};

export default User;