import { headers } from "next/headers";
import React from "react";

import { refreshVerify } from "@/utils/jwt";

import MainLogo from "./(header)/mainLogo";
import Menu from "./(header)/menu";
import MobileMenu from "./(header)/MobileMenu";
import User from "./(header)/user";
import Alert from "./(joke)/alert";
import Fast from "./(joke)/FAST";
import FireworkFrame from "./(joke)/fireworks";

const LoginedLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookie = headers().get("cookie")?.split("; ").map((c: string) => {
    const [key, value] = c.split("=");
    return {
      key: key,
      value: value,
    };
  }) || [];
  const cookieJSON = Object.fromEntries(cookie.map((c: any) => [c.key, c.value]));
  const { refreshToken } = cookieJSON;
  const veryfied = await refreshVerify(refreshToken);

  return (
    <>
      {
        veryfied.ok ? (
          <header 
            className="-mt-safe pt-safe min-h-14 z-50 bg-background/50 backdrop-blur-xl fixed top-0 left-0 w-full px-4 border-b border-text/10 flex flex-row items-center justify-center"
            style={{
              height: "calc(env(safe-area-inset-top) + 3.5rem)",
            }}
          >
            <div className="flex flex-row items-center justify-between w-full max-w-[700px]">
              <MainLogo />
              <Menu />
            </div>
            <MobileMenu />
          </header>
        ) : null
      }
      <div className="h-14" />
      {
        veryfied.ok ? <User payload={veryfied.payload} /> : null
      }
      {children}
      <div className="absolute top-0 left-0 -z-[1]">
        <FireworkFrame />
      </div>
      <footer className="w-full pt-5 pb-8">
        <article className="w-full flex flex-col justify-center items-center gap-2">
          <Fast />
          <Alert />
          <p className="text-text/40 text-sm">급식 확인은 <a className="text-primary/40 underline" href="https://디미고급식.com/" target="_blank" rel="noreferrer">디미고 급식</a>에서 확인해주세요!</p>
          <p className="text-text/40 text-sm">&#34;내가 이것보단 잘 만들겠다 ㅋㅋ&#34;하는 경우엔 <a className="text-primary/40 underline" href="https://github.com/jeamxn/dimigoin-pull-service" target="_blank" rel="noreferrer">직접 만드세요</a>!</p>
          <p className="text-text/40 text-sm">오류 및 기타 문의 사항은 <a className="text-primary/40 underline" href="kakaoopen://join?l=%2Fme%2FJeamxn&r=EW">최재민</a>에게 연락바랍니다!</p>
          <p className="text-text/40 text-sm">자세한 서비스 사용 방법은 <a className="text-primary/40 underline" href="https://docs.dimigo.net" target="_blank" rel="noreferrer">여기</a>를 참고 해주세요!</p>
        </article>
      </footer>
    </>
  );
};

export default LoginedLayout;