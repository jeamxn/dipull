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
                  <p className="text-base text-primary">세탁기, 건조기 사용 전후로 알림을 전송합니다.</p>
                  <p className="text-base text-primary">잔류 신청 마감 알림을 전송합니다.</p>
                  <p className="text-base text-primary">메뉴의 종모양을 클릭하여 알림 권한을 허용해주세요!</p>
                  <p className="text-base text-primary">핸드폰 설정에서 사용하는 브라우저의 알림 또한 허용해주세요.</p>
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
