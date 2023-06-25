import Image from "next/image";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

import styles from "%/Login.module.css";
import DefaultHead from "@/components/DefaultHead";
import * as env from "@/utils/env";
import { myInfoAtom } from "@/utils/states";

export default function Login() {
  const [myInfo, setMyInfo] = useRecoilState(myInfoAtom);
  useEffect(() => {
    setMyInfo(false);
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }, []);

  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${env.KAKAO_REST_API_KEY}&redirect_uri=${env.KAKAO_REDIRECT_URI}&response_type=code`;
  const handleLogin = ()=>{
    window.location.href = kakaoURL;
  };
  return (
    <>
      <DefaultHead></DefaultHead>
      <main className="main">
        <div className={styles.login}>
          <div className={styles.titles}>
            <Image src="/icon.png" width="50" height="50" alt="logo" />
            <div className={styles.title}>디미고인 풀 서비스</div>
          </div>
          <div className={styles.kakaoLogin} onClick={handleLogin}>
            <div className={styles.kakaoLoginLogo}></div>
            <div className={styles.kakaoLoginText}>카카오 계정으로 로그인하기</div>
          </div>
        </div>
      </main>
    </>
  );
}
