"use client";

import React from "react";

import { MachineType, machineTypeToKorean } from "@/app/machine/[type]/utils";
import { useAuth } from "@/hooks";


const Machine = ({ params }: { params: { type: MachineType } }) => {
  const { user } = useAuth();
  const current_korean = machineTypeToKorean(params.type);

  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold px-4 text-text dark:text-text-dark">{current_korean}기 목록 설정하기</p>
        
      </div>
      
    </>
  );
};

export default Machine;