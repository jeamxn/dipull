import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import styles from "&/pages/Hosil.module.css";
import { isAdminAtom, isLoadingAtom, myInfoAtom, userInfoAtom } from "@/utils/states";

const roomInfo = {
  "407호": 6,
  "409호": 6,
  "410호": 6,
  "411호": 6,
  "412호": 6,
  "413호": 6,
  "414호": 6,
  "415호": 6,
  "416호": 6,
  "417호": 6,
  "418호": 6,
  "419호": 6,
  "420호": 6,
  "421호": 6,
  "422호": 6,
  "423호": 6,
  "501호": 8,
  "502호": 8,
  "503호": 8,
  "505호": 6,
  "506호": 6,
  "507호": 6,
};

export default function Hosil() {
  const [loading, setLoading] = useRecoilState(isLoadingAtom);
  const [myInfo, setMyInfo] = useRecoilState(myInfoAtom);
  const [checker, setChecker] = useRecoilState(userInfoAtom);
  const [isAdmin, setIsAdmin] = useRecoilState(isAdminAtom);

  // const roomData = {
  //   "407호": ["2629 최재민", "2629 최재민민"]
  // };

  const [count, setCount] = useState(false);

  const [roomData, setRoomData] = useState({});
  const [selected, setSelected] = useState<[string, number]>(["", 0]);

  const getData = async () => {
    setLoading(true);
    const { data } = await axios.get("/api/hosil");
    setRoomData(data.rtn);
    setCount(data.mySelect);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return myInfo ? (
    <div className={styles.hosil}>
      <div className={styles.box}>
        <div className={styles.title}>호실 선택</div>
        <div className={styles.listBox}>
          <div className={styles.list}>
            <div className={styles.listBox}>
              <div className={styles.hosilTitle}>호실</div>
              <div className={styles.hosilBox}>1번<br/>위층</div>
              <div className={styles.hosilBox}>2번<br/>아래층</div>
              <div className={styles.hosilBox}>3번<br/>위층</div>
              <div className={styles.hosilBox}>4번<br/>아래층</div>
              <div className={styles.hosilBox}>5번<br/>위층</div>
              <div className={styles.hosilBox}>6번<br/>아래층</div>
              <div className={styles.hosilBox}>7번<br/>위층</div>
              <div className={styles.hosilBox}>8번<br/>아래층</div>
            </div>
            {
              Object.keys(roomInfo).map((room, i1) => {
                return (
                  <div className={styles.listBox} key={i1}>
                    <div className={styles.hosilTitle}>{room}</div>
                    {
                      [...Array(roomInfo[room])].map((_, i2) => {
                        const dataAble = roomData[room] && roomData[room][i2];
                        const isSelected = selected[0] === room && selected[1] === i2;
                        const isMyHosil = roomData[room] && roomData[room][i2] === `${myInfo.number} ${myInfo.name}`;
                        return (
                          <div 
                            key={i2} 
                            className={[
                              styles.hosilBox,
                              !dataAble ? styles.dataAble : "",
                              isSelected ? styles.selected : "",
                              isMyHosil ? styles.myHosil : "",
                            ].join(" ")}
                            onClick={() => {
                              if(dataAble || count) return;
                              if(room === selected[0] && i2 === selected[1]) return setSelected(["", 0]);
                              setSelected([room, i2]);
                            }}
                          >
                            {
                              dataAble ? 
                                <>{roomData[room][i2]}</>
                                : 
                                <>{i2 + 1}번<br/>선택 가능</>
                            }
                          </div>
                        );
                      })
                    }
                  </div>
                );
              })
            }
          </div>
        </div>
        {
          count ? 
            <input
              type="button"
              value={"선호 호실 신청 취소하기"}
              className={[styles.button].join(" ")}
              onClick={async () => {
                setLoading(true);
                const {data} = await axios({
                  method: "DELETE",
                  url: "/api/hosil",
                });
                setSelected(["", 0]);
                alert(data.message);
                setLoading(false);
                getData();
              }}     
            />
            : 
            <input
              type="button"
              value={selected[0] ? `${selected[0]} ${selected[1] + 1}번 자리 선택하기`: "호실과 번호를 골라주세요"}
              className={[styles.button].join(" ")}
              style={{
                opacity: selected[0] ? 1 : 0.5,
              }}
              onClick={async () => {
                if(!selected[0]) return;
                if(roomData[selected[0]] && roomData[selected[0]][selected[1]]) return;
                setLoading(true);
                const {data} = await axios({
                  method: "POST",
                  url: "/api/hosil",
                  data: {
                    hosil: selected[0],
                    num: selected[1],
                  }
                });
                setSelected(["", 0]);
                alert(data.message);
                setLoading(false);
                getData();
              }}     
            />
        }
        
      </div>
    </div>
  ) : null;
}