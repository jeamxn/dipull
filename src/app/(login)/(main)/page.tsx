import "moment-timezone";
import moment from "moment";
import { cookies } from "next/headers";
import React from "react";

import { getIwannagohome } from "@/app/api/iwannagohome/server";
import { getMeal } from "@/app/api/meal/[date]/server";
import { getTimetable } from "@/app/api/timetable/[grade]/[class]/server";
import { defaultUserData } from "@/app/auth/type";
import Insider from "@/provider/insider";
import { verify } from "@/utils/jwt";

import HosilInfo from "./hosilInfo";
import Iwannagohome from "./iwannagohome";
import Luck from "./luck";
import Meal from "./meal";
import Timetable from "./timetable";

const Home = async () => {
  const accessToken = cookies().get("accessToken")?.value || "";
  const verified = await verify(accessToken|| "");
  const userInfo = verified.payload?.data || defaultUserData;

  const iwannagoHomeInit = await getIwannagohome(userInfo.id);
  const gradeClass = Math.floor(userInfo.number / 100);
  const timetalbeInit = await getTimetable(Math.floor(gradeClass / 10), gradeClass % 10);
  const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
  const mealInit = await getMeal(today);

  return (
    <>
      <Insider>
        {
          userInfo.type === "student" ? (
            <article className="flex flex-col gap-3">
              <section className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold">알림 기능 추가</h1>
                <div className="flex flex-col gap-1">
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
        <Timetable
          init={timetalbeInit}
          userInfo={userInfo}
        />
        <Meal init={mealInit} />
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
