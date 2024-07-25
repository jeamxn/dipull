"use client";

import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React from "react";

import { useAlertModalDispatch } from "@/components/AlertModal";
import { useAuth } from "@/hooks";

const Stay = () => {
  const { user, needLogin } = useAuth();
  const [search, setSearch] = React.useState("");

  return (
    <div className="flex flex-col gap-4 w-full">
      
      
    </div>
  );
};

export default Stay;