"use client";
import React from "react";
import { useRecoilValue } from "recoil";

import { isFooterAtom } from "@/utils/states";

import Alert from "../(joke)/alert";
import Fast from "../(joke)/FAST";

const Footer = () => {
  const isFooter = useRecoilValue(isFooterAtom);
  return isFooter ? (
    <footer className="w-full pt-5 pb-8">
      <article className="w-full flex flex-col justify-center items-center gap-2">
        <Fast />
        <Alert />
        <p className="text-text/40 text-sm text-center">급식 확인은 <a className="text-primary/40 underline" href="https://디미고급식.com/" target="_blank" rel="noreferrer">디미고 급식</a>에서 확인해주세요!</p>
        <p className="text-text/40 text-sm text-center">서비스 사용 방법은 <a className="text-primary/40 underline" href="https://docs.dimigo.net" target="_blank" rel="noreferrer">여기</a>를 참고 해주세요!</p>
      </article>
    </footer>
  ) : null;
};

export default Footer;