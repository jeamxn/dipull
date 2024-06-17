import * as jose from "jose";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";

import { getIwannagohome } from "@/app/api/iwannagohome/get";
import { TokenInfo, defaultUserData } from "@/app/auth/type";
import Comments from "@/components/comments";
import Insider from "@/provider/insider";
import { verify } from "@/utils/jwt";

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
                <h1 className="text-xl font-semibold">개발 공지</h1>
                <div className="flex flex-col gap-1">
                  <h1 className="text-base text-primary">SSR(서버 사이드 랜더링) 기술을 테스트 중입니다.</h1>
                  <h1 className="text-base text-primary">데이터 표시에 오류가 있을 수 있는 점 양해 바랍니다.</h1>
                </div>
              </section>
            </article>
          ) : null
        }
        <Luck />
        <Iwannagohome
          init={{
            count: iwannagoHomeInit.count,
            my: iwannagoHomeInit.my,
            date: iwannagoHomeInit.date,
          }}
        />
        <Comments />
      </Insider>
    </>
  );
};

export default Home;
