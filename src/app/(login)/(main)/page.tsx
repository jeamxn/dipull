"use client";

import * as jose from "jose";
import Link from "next/link";
import React from "react";

import { TokenInfo, defaultUserData } from "@/app/auth/type";
import Comments from "@/components/comments";
import Insider from "@/provider/insider";

import Iwannagohome from "./iwannagohome";
import Luck from "./luck";
// import Meal from "./meal";
// import Timetable from "./timetable";

const Home = () => {
  const [userInfo, setUserInfo] = React.useState(defaultUserData);

  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")!;
    const decrypt = jose.decodeJwt(accessToken) as TokenInfo;
    setUserInfo(decrypt.data);
  }, []);

  return (
    <>
      <Insider>
        {
          userInfo.type === "student" ? (
            <article className="flex flex-col gap-3">
              <section className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold">디미고 대나무 숲</h1>
                <div className="flex flex-row gap-1">
                  <h1 className="text-base text-primary">새롭게 추가된 기능을 확인해보세요!</h1>
                  <Link href="/bamboo" prefetch>
                    <h1 className="text-base text-primary underline">바로가기</h1>
                  </Link>
                </div>
              </section>
            </article>
          ) : null
        }
        <Luck />
        <Iwannagohome />
        <Comments />
      </Insider>
    </>
  );
};

export default Home;
