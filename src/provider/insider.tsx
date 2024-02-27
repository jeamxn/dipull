/* eslint-disable @next/next/no-img-element */
import * as jose from "jose";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

import { defaultUserData, type TokenInfo, type UserData } from "@/app/auth/type";
import instance from "@/utils/instance";

const menu = [
  {
    url: "/",
    name: "정보",
  },
  {
    url: "/washer",
    name: "세탁",
  },
  {
    url: "/dryer",
    name: "건조",
  },
  {
    url: "/stay",
    name: "잔류",
  },
  {
    url: "/outing",
    name: "외출",
  }
];

const Insider = ({
  children,
  className,
}: Readonly<{
  children?: React.ReactNode;
  className?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>["className"];
}>) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = React.useState(defaultUserData);

  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")!;
    const decrypt = jose.decodeJwt(accessToken) as TokenInfo;
    setUserInfo(decrypt.data);
  }, []);

  const logout = async () => {
    const res = await instance.get("/auth/logout");
    router.push("/login");
    console.log(res.data);
  };

  const pathname = usePathname();
  return (
    <>
      <header className="w-full">
        <article className="w-full flex justify-center items-center border-b border-text/10 px-5 py-3">
          <p className="text-primary text-lg font-semibold">디미고인 풀 서비스 V3</p>
        </article>
        <article className="w-full p-5 border-b border-text/10 flex flex-row items-center gap-4">
          <img src={userInfo.profile_image} alt={userInfo.name} width={60} height={60} className="rounded-full" />
          <figure className="flex flex-col gap-1 justify-center items-start">
            <p className="font-semibold text-lg">{userInfo.number} {userInfo.name}</p>
            <button onClick={logout} className="text-sm text-text/40 hover:text-primary transition-colors">로그아웃</button>
          </figure>
        </article>
        <nav className="px-5 w-full border-b border-text/10 flex flex-row justify-around gap-4">
          {
            menu.map((item, index) => {
              const isCurrentPage = pathname === item.url;
              return (
                <Link 
                  key={index} 
                  href={item.url}
                  className={[
                    "w-full text-center py-3 text-sm font-semibold text-text/40",
                    isCurrentPage ? "border-b-2 border-primary text-text/100" : ""
                  ].join(" ")}
                >
                  {item.name}
                </Link>
              );
            })
          }
        </nav>
      </header>
      <main className={["p-5", className].join(" ")}>
        {children}
      </main>
      <footer className="w-full">
        <article className="w-full flex justify-center items-center">
          <p className="text-text/40 text-sm">오류 및 기타 문의 사항은 <a className="text-primary/40 underline" href="kakaoopen://join?l=%2Fme%2FJeamxn&r=EW" rel="noreffer">최재민</a>에게 연락바랍니다!</p>
        </article>
      </footer>
    </>
  );
};

export default Insider;