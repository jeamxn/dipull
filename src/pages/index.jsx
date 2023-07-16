import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import styles from "%/Home.module.css";
import DefaultHead from "@/components/DefaultHead";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Hosil from "@/components/pages/Hosil";
import Meal from "@/components/pages/Meal";
import Outing from "@/components/pages/Outing";
import Stay from "@/components/pages/Stay";
import Wash from "@/components/pages/Wash";
import UserInfo from "@/components/UserInfo";
import loginCheck from "@/utils/loginCheck";
import { isAdminAtom, isLoadingAtom, myInfoAtom } from "@/utils/states";

const menu = [
  {
    name: "정보",
    body: Meal
  },
  {
    name: "세탁",
    body: Wash
  },
  {
    name: "잔류",
    body: Stay
  },
  {
    name: "외출",
    body: Outing
  }
];

export default function Home() {
  const router = useRouter();
  const [myInfo, setMyInfo] = useRecoilState(myInfoAtom);
  const [isAdmin, setIsAdmin] = useRecoilState(isAdminAtom);
  const [selected, setSelected] = useState(menu[0]);
  const [loading, setLoading] = useRecoilState(isLoadingAtom);

  useEffect(() => {
    loginCheck(setMyInfo, setIsAdmin, router);
  }, []);

  // useEffect(() => {
  //   console.log(myInfo);
  //   const grade = Math.floor(myInfo.number / 1000);
  //   if(
  //     (
  //       grade !== 2 || 
  //       myInfo.gender !== "male"
  //     )
  //     &&
  //     myInfo.name !== "허양회"
  //   ) return;
  //   if(menu[menu.length - 1].name === "호실") return;
  //   menu.push({
  //     name: "호실",
  //     body: Hosil
  //   });
  // }, [myInfo]);

  useEffect(() => {
    console.log(`isAdmin: ${isAdmin}`);
  }, [isAdmin]);

  const Inner = selected.body;

  return (
    <>
      <DefaultHead></DefaultHead>
      <main className={["main", styles.main].join(" ")}>
        <Loading show={loading}></Loading>
        {
          myInfo && (
            <>
              <Header></Header>
              <UserInfo></UserInfo>
              <div className={styles.homeType}>
                {
                  menu.map((item, i) => (
                    <div 
                      className={[styles.homeTypeBtn, selected.name === item.name && styles.homeTypeBtnSelected].join(" ")} 
                      key={i}
                      onClick={() => setSelected(item)}
                    >
                      {item.name}
                    </div>
                  ))
                }
              </div>
              <Inner />
              <div className={styles.error}>오류 및 기타 문의 사항은 <a href="kakaoopen://join?l=%2Fme%2FJeamxn&r=EW" rel="noreferrer">최재민</a>에게 연락바랍니다!</div>
            </>
          )
        }
        
      </main>
    </>
  );
}
