/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

import styles from "&/UserInfo.module.css";
import { myInfoAtom, userInfoAtom } from "@/utils/states";

const UserInfo = () => {
  const router = useRouter();
  const [myInfo, setMyInfo] = useRecoilState(myInfoAtom);
  const [checker, setChecker] = useRecoilState(userInfoAtom);

  useEffect(() => {
    if(!myInfo) return;
    setChecker(myInfo.userInfo);
  }, [myInfo, setChecker]);

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
            <Image src={checker.wash ? "/icons/check.svg" : "/icons/no.svg"} width={20} height={20} alt="check" />
          </div>

          <div className={styles.infoLine}></div>

          <div className={styles.info}>
            <div className={styles.infoTitle}>잔류</div>
            <Image src={checker.stay ? "/icons/check.svg" : "/icons/no.svg"} width={20} height={20} alt="check" />
          </div>

          <div className={styles.infoLine}></div>

          <div className={styles.info}>
            <div className={styles.infoTitle}>외출</div>
            <Image src={checker.outing ? "/icons/check.svg" : "/icons/no.svg"} width={20} height={20} alt="check" />
          </div>
        </div>
      </div>

      <div className={styles.names}>
        <div className={styles.name}>{myInfo.number} {myInfo.name}</div>
        {/* <div 
          className={styles.logout}
          onClick={() => {
            router.push("/edit");
          }}
        >
          정보수정
        </div>
        <div className={styles.id}>|</div> */}
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
