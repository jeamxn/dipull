/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

import styles from "&/UserInfo.module.css";
import { myInfoAtom, userInfoAtom } from "@/utils/states";

const No = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 11H14C14.2833 11 14.5208 10.9042 14.7125 10.7125C14.9042 10.5208 15 10.2833 15 10C15 9.71667 14.9042 9.47917 14.7125 9.2875C14.5208 9.09583 14.2833 9 14 9H6C5.71667 9 5.47917 9.09583 5.2875 9.2875C5.09583 9.47917 5 9.71667 5 10C5 10.2833 5.09583 10.5208 5.2875 10.7125C5.47917 10.9042 5.71667 11 6 11ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="rgba(var(--color-primary), 1)" fillOpacity="0.25"/>
  </svg>
);

const Check = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.1 12.55L6.95 10.4C6.76667 10.2167 6.53333 10.125 6.25 10.125C5.96667 10.125 5.73333 10.2167 5.55 10.4C5.36667 10.5833 5.275 10.8167 5.275 11.1C5.275 11.3833 5.36667 11.6167 5.55 11.8L8.4 14.65C8.6 14.85 8.83333 14.95 9.1 14.95C9.36667 14.95 9.6 14.85 9.8 14.65L15.45 9C15.6333 8.81667 15.725 8.58333 15.725 8.3C15.725 8.01667 15.6333 7.78333 15.45 7.6C15.2667 7.41667 15.0333 7.325 14.75 7.325C14.4667 7.325 14.2333 7.41667 14.05 7.6L9.1 12.55ZM10.5 20.75C9.11667 20.75 7.81667 20.4875 6.6 19.9625C5.38333 19.4375 4.325 18.725 3.425 17.825C2.525 16.925 1.8125 15.8667 1.2875 14.65C0.7625 13.4333 0.5 12.1333 0.5 10.75C0.5 9.36667 0.7625 8.06667 1.2875 6.85C1.8125 5.63333 2.525 4.575 3.425 3.675C4.325 2.775 5.38333 2.0625 6.6 1.5375C7.81667 1.0125 9.11667 0.75 10.5 0.75C11.8833 0.75 13.1833 1.0125 14.4 1.5375C15.6167 2.0625 16.675 2.775 17.575 3.675C18.475 4.575 19.1875 5.63333 19.7125 6.85C20.2375 8.06667 20.5 9.36667 20.5 10.75C20.5 12.1333 20.2375 13.4333 19.7125 14.65C19.1875 15.8667 18.475 16.925 17.575 17.825C16.675 18.725 15.6167 19.4375 14.4 19.9625C13.1833 20.4875 11.8833 20.75 10.5 20.75ZM10.5 18.75C12.7333 18.75 14.625 17.975 16.175 16.425C17.725 14.875 18.5 12.9833 18.5 10.75C18.5 8.51667 17.725 6.625 16.175 5.075C14.625 3.525 12.7333 2.75 10.5 2.75C8.26667 2.75 6.375 3.525 4.825 5.075C3.275 6.625 2.5 8.51667 2.5 10.75C2.5 12.9833 3.275 14.875 4.825 16.425C6.375 17.975 8.26667 18.75 10.5 18.75Z" fill="rgba(var(--color-8), 1)"/>
  </svg>
);

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
            {checker.wash ? <Check /> : <No />}
          </div>

          <div className={styles.infoLine}></div>

          <div className={styles.info}>
            <div className={styles.infoTitle}>잔류</div>
            {checker.stay ? <Check /> : <No />}
          </div>

          <div className={styles.infoLine}></div>

          <div className={styles.info}>
            <div className={styles.infoTitle}>외출</div>
            {checker.outing ? <Check /> : <No />}
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
