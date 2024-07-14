"use client";

import React from "react";
import { useSetRecoilState } from "recoil";

import { loadingAtom } from "@/utils/states";

const Mover = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const setLoading = useSetRecoilState(loadingAtom);
  return (
    <button
      {...props}
      onClick={(e) => {
        !props.disabled && setLoading(true);
        if (props.onClick) 
          props.onClick(e);
      }}
    />
  );
};

export default Mover;