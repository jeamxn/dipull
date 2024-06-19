"use client";

import Link, { LinkProps } from "next/link";
import React from "react";
import { useSetRecoilState } from "recoil";

import { loadingAtom } from "@/utils/states";

const Linker = (
  props: React.PropsWithChildren<LinkProps> & React.AnchorHTMLAttributes<HTMLAnchorElement>
) => {
  const setLoading = useSetRecoilState(loadingAtom);
  return (
    <Link
      {...props}
      onClick={(e) => {
        setLoading(true);
        if (props.onClick) 
          props.onClick(e);
      }}
    />
  );
};

export default Linker;