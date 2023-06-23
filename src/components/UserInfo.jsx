/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

import styles from "&/UserInfo.module.css";
import { myInfoAtom } from "@/utils/states";

const UserInfo = () => {
  const router = useRouter();
  const [myInfo, setMyInfo] = useRecoilState(myInfoAtom);
  if(!myInfo) return null;

  return (
    <div className={styles.userInfo}>
      <div className={styles.myInfo}>
        <img 
          src={myInfo.profile_image} 
          className={styles.profileImage} 
          alt="profile image" 
        />
        <div className={styles.check}>
          <div className={styles.info}>
            <div className={styles.infoTitle}>세탁</div>
            <div className={styles.infoCont}>신청완료</div>
          </div>

          <div className={styles.infoLine}></div>

          <div className={styles.info}>
            <div className={styles.infoTitle}>잔류</div>
            <div className={styles.infoCont}>신청완료</div>
          </div>

          <div className={styles.infoLine}></div>

          <div className={styles.info}>
            <div className={styles.infoTitle}>금귀</div>
            <div className={styles.infoCont}>신청완료</div>
          </div>
        </div>
      </div>

      <div className={styles.names}>
        <div className={styles.name}>{myInfo.nickname}</div>
        <div className={styles.id}>@{myInfo.id}</div>
        <div 
          className={styles.logout}
          onClick={() => {
            router.push("/login");
          }}
        >
          로그아웃
        </div>
      </div>


    </div>
  );
};

export default UserInfo;