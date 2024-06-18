import { cookies } from "next/headers";
import React from "react";

import { getIwannagohome } from "@/app/api/iwannagohome/server";
import { defaultUserData } from "@/app/auth/type";
import Insider from "@/provider/insider";
import { verify } from "@/utils/jwt";

import HosilInfo from "./hosilInfo";
import Iwannagohome from "./iwannagohome";
import Luck from "./luck";

const Home = async () => {
  const accessToken = cookies().get("accessToken")?.value || "";
  const verified = await verify(accessToken|| "");
  const userInfo = verified.payload?.data || defaultUserData;

  const iwannagoHomeInit = await getIwannagohome(userInfo.id);

  return (
    <>
      <Insider>
        {
          userInfo.type === "student" ? (
            <article className="flex flex-col gap-3">
              <section className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold">업데이트 내역</h1>
                <div className="flex flex-col gap-1">
                  <p className="text-base text-primary">1. SSR(서버 사이드 랜더링) 기술을 도입했습니다!</p>
                  <p className="text-base text-primary">2. 기상송 신청이 3개 이상 되는 버그를 해결했습니다.</p>
                  <p className="text-base text-primary">3. 기상송 관련 취약점을 해결했습니다.</p>
                </div>
              </section>
            </article>
          ) : null
        }
        {/* {
          userInfo.number > 3000 && userInfo.gender === "male" ? (
            <HosilInfo />
          ) : null
        } */}
        <Luck />
        <Iwannagohome
          init={{
            count: iwannagoHomeInit.count,
            my: iwannagoHomeInit.my,
            date: iwannagoHomeInit.date,
          }}
          userInfo={userInfo}
        />
        {/* <Comments /> */}
      </Insider>
    </>
  );
};

export default Home;
