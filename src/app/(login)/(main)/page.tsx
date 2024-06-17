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
