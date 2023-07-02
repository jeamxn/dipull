import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useRecoilState } from "recoil";

import styles from "%/Register.module.css";
import DefaultHead from "@/components/DefaultHead";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { isLoadingAtom } from "@/utils/states";

const Edit = () => {
  const router = useRouter();

  const [loading, setLoading] = useRecoilState(isLoadingAtom);

  const [myNumber, setMyNumber] = useState("");
  const [myName, setMyName] = useState("");
  const [myGender, setMyGender] = useState("male");

  const update = async () => {
    if(!myNumber || !myName) return;
    setLoading(true);
    
    try{
      const {data} = await axios({
        method: "POST",
        url: "/api/userInfo",
        data: {
          number: myNumber,
          name: myName,
          gender: myGender
        }
      });
      alert(data.message);
      router.push("/");
    }
    catch{
      alert("로그인 후 이용해주세요.");
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <>
      <DefaultHead></DefaultHead>
      <main className={["main", styles.main].join(" ")}>
        <Loading show={loading}></Loading>
        <Header></Header>
        <div className={styles.register}>
          <div className={[styles.box, styles.defaultSetting].join(" ")}>
            <div className={styles.title}>기초 정보 입력</div>
            <div className={styles.select}>
              <div className={styles.rowInput}>
                <input
                  type="number"
                  value={myNumber.replace(/[^0-9]/g, "")}
                  onChange={(e) => {
                    if(e.target.value.length > 4) return;
                    if(!(0<= Number(e.target.value[0]) && Number(e.target.value[0]) <= 9) && e.target.value[0]) return;
                    if(!(0<= Number(e.target.value[1]) && Number(e.target.value[1]) <= 9) && e.target.value[1]) return;
                    setMyNumber(e.target.value);
                  }}
                  className={styles.input}
                  placeholder="학번"
                />
                <input
                  type="text"
                  value={myName.replaceAll(" ", "")}
                  onChange={(e) => setMyName(e.target.value)}
                  className={styles.input}
                  placeholder="이름"
                />
              </div>
              <div className={styles.rowInput}>
                <div className={styles.cont}>성별: </div>
                {
                  [["male", "남자"], ["female", "여자"]].map((e, i) => {
                    return (
                      <div
                        className={[styles.genderSelect, myGender === e[0] && styles.genderSelected].join(" ")}
                        onClick={() => setMyGender(e[0])}
                        key={i}
                      >
                        {e[1]}
                      </div>
                    );
                  })
                }
              </div>
            </div>

            <input
              type="button"
              value="입력하기"
              style={{ opacity: myNumber && myName ? 1 : 0.5 }}
              disabled={!myNumber || !myName}
              onClick={update}
              className={styles.button}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Edit;