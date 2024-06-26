"use client";

import React from "react";
import { useRecoilValue } from "recoil";

import { UserData } from "@/app/auth/type";
import { isHeaderAtom } from "@/utils/states";

import Loading from "./loading";
import MainLogo from "./mainLogo";
import Menu from "./menu";
import MobileMenu from "./MobileMenu";
import Notification from "./notification";
const Header = ({
  userInfo,
}: {
  userInfo: UserData,
}) => {
  const isHeader = useRecoilValue(isHeaderAtom);

  return isHeader ? (
    <>
      <header 
        className="-mt-safe pt-safe min-h-14 z-50 bg-background/50 backdrop-blur-xl fixed top-0 left-0 w-full px-4 border-b border-text/10 flex flex-row items-center justify-center"
        style={{
          height: "calc(env(safe-area-inset-top) + 3.5rem)",
        }}
      >
        <div className="flex flex-row items-center justify-between w-full max-w-[700px]">
          <MainLogo userInfo={userInfo} />
          <Menu userInfo={userInfo} />
        </div>
        <div className="flex flex-row items-center relative">
          <Notification />
          <MobileMenu userInfo={userInfo} />
        </div>
        <Loading />
      </header>
      <div 
        className="min-h-14" 
        style={{
          height: "calc(env(safe-area-inset-top) + 3.5rem)",
        }}
      />
    </>
  ) : null;
};

export default Header;