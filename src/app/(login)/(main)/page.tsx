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
                <h1 className="text-xl font-semibold">알림 기능 추가</h1>
                <div className="flex flex-col gap-1">
                  <p className="text-base text-primary">세탁/건조 시간 10분, 30분 전에 푸시 알림을 보냅니다!</p>
                  <p className="text-base text-primary">메뉴의 종모양을 클릭하여 알림 권한을 허용해주세요!</p>
                  <p className="text-base text-primary">아직 테스트 중이기 때문에, 알림이 제대로 가지 않을 수 있어요!</p>
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
