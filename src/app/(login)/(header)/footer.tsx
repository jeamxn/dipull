"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useRecoilValue } from "recoil";

import { UserInfo } from "@/app/api/teacher/userinfo/utils";
import instance from "@/utils/instance";
import { isFooterAtom } from "@/utils/states";

import Alert from "../(joke)/alert";
import Fast from "../(joke)/FAST";

const Footer = ({
  userInfo
}: {
  userInfo: UserInfo;
  }) => {
  const router = useRouter();
  const isFooter = useRecoilValue(isFooterAtom);

  const logout = async () => {
    await instance.get("/auth/logout");
    router.push("/login");
  };

  React.useEffect(() => {
    if (!userInfo.id) logout();
  }, []);

  return isFooter ? (
    <footer className="w-full pt-5 pb-8">
      <article className="w-full flex flex-col justify-center items-center gap-2">
        <Fast />
        <Alert />
        <p className="text-text/40 text-sm text-center">급식 확인은 <a className="text-primary/40 underline" href="https://디미고급식.com/" target="_blank" rel="noreferrer">디미고 급식</a>에서 확인해주세요!</p>
        <p className="text-text/40 text-sm text-center">서비스 사용 방법은 <a className="text-primary/40 underline" href="https://docs.dimigo.net" target="_blank" rel="noreferrer">사용 설명서</a>를 참고 해주세요!</p>
        <p className="text-text/40 text-sm">오류 및 기타 문의 사항은 <a className="text-primary/40 underline" href="https://discord.gg/U7FBXyPKM6" target="_blank" rel="noreferrer">디풀 개발자 커뮤니티</a>에 연락바랍니다!</p>
      </article>
    </footer>
  ) : null;
};

export default Footer;