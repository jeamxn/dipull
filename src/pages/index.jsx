import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import styles from "%/Home.module.css";
import DefaultHead from "@/components/DefaultHead";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Outing from "@/components/pages/Outing";
import Stay from "@/components/pages/Stay";
import Wash from "@/components/pages/Wash";
import UserInfo from "@/components/UserInfo";
import loginCheck from "@/utils/loginCheck";
import { isLoadingAtom, myInfoAtom } from "@/utils/states";

const menu = [
  {
    name: "세탁",
    body: Wash
  },
  {
    name: "잔류",
    body: Stay
  },
  {
    name: "외출/금귀",
    body: Outing
  }
];

export default function Home() {
  const router = useRouter();
  const [myInfo, setMyInfo] = useRecoilState(myInfoAtom);
  const [selected, setSelected] = useState(menu[1]);
  const [loading, setLoading] = useRecoilState(isLoadingAtom);

  useEffect(() => {
    loginCheck(setMyInfo, router);
  }, []);

  const Inner = selected.body;

  return myInfo && (
    <>
      <DefaultHead></DefaultHead>
      <main className={["main", styles.main].join(" ")}>
        <Loading show={loading}></Loading>
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
      </main>
    </>
  );
}
