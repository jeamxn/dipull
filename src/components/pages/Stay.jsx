import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import styles from "&/pages/Stay.module.css";
import { isLoadingAtom, myInfoAtom, userInfoAtom } from "@/utils/states";


export default function Stay() {
  const [loading, setLoading] = useRecoilState(isLoadingAtom);
  const [myInfo, setMyInfo] = useRecoilState(myInfoAtom);
  const [select, setSelect] = useState("#0");
  const [isClassStay, setIsClassStay] = useState(false);
  const [seatData, setSeatData] = useState([]);
  const [userSeatData, setUserSeatData] = useState([]);
  const [myStayData, setMyStayData] = useState(null);
  const [studentList, setStudentList] = useState({});
  const [isOpened, setIsOpened] = useState(false);
  const [checker, setChecker] = useRecoilState(userInfoAtom);

  const dataLoad = async () => {
    setLoading(true);
    const { data } = await axios({
      method: "GET",
      url: "/api/stay",
    });
    setIsClassStay(data.isClassStay);
    setSeatData(data.seatData);
    setUserSeatData(data.seat);
    setMyStayData(data.myStay);
    setStudentList(data.students);
    setIsOpened(data.isOpened);

    //myStayData
    const newChecker = { ...checker };
    if(newChecker.stay !== undefined){
      newChecker.stay = data.myStay ? true : false;
      if(!data.myStay) {
        newChecker.outing = false;
      }
      setChecker(newChecker);
    }

    setLoading(false);
  };

  useEffect(() => {
    dataLoad();
  }, []);

  const submit = async () => {
    setLoading(true);

    if(!isClassStay && select === "#0") {
      alert("잔류 좌석을 선택해주세요.");
      setLoading(false);
      return;
    }

    const { data } = await axios({
      method: "POST",
      url: "/api/stay",
      data: {
        seat: select,
      },
    });
    alert(data.message);
    setSelect("#0");
    await dataLoad();
    setLoading(false);
  };

  const cancle = async () => {
    setLoading(true);

    const { data } = await axios({
      method: "DELETE",
      url: "/api/stay",
    });
    alert(data.message);

    await dataLoad();
    setLoading(false);
  };

  const allMany = {
    male: 0,
    female: 0
  };

  return (
    <div className={styles.stay}>
      <div className={styles.box}>
        <div className={styles.title}>잔류 신청하기 / 현황</div>
        <table className={styles.table}>
          <tbody className={styles.tableI}>
            <tr className={styles.tr}>
              <th className={styles.thn}>#</th>
              {
                Array(17).fill(0).map((_, i) => (
                  <th key={i} className={styles.thInner}>{i + 1}</th>
                ))
              }
            </tr>
            {
              Array(14).fill(0).map((_, i) => {
                const n = String.fromCharCode(i + 65);
                return (
                  <tr key={i} className={styles.tr}>
                    <td className={styles.tdn}>{n}</td>
                    {
                      Array(17).fill(0).map((_, j) => {
                        let seat = null;
                        for(const e of seatData) {
                          if (e.seat[n] && e.seat[n].includes(j + 1)) {
                            seat = e;
                            break;
                          }
                        }
                        const name = userSeatData[`${n}${j + 1}`]?.name ? userSeatData[`${n}${j + 1}`]?.name : null;
                        let selectAble = 
                          myInfo.gender === seat?.gender && 
                          seat?.grade.includes(Math.floor(myInfo.number / 1000)) && 
                          !name && !myStayData;

                        return (
                          <td 
                            key={j}
                            onClick={() => {
                              if(!selectAble) return;

                              if (select === `${n}${j + 1}`) {
                                setSelect("#0");
                              } else {
                                setSelect(`${n}${j + 1}`);
                              }
                            }}
                            style={{ 
                              background: select === `${n}${j + 1}` ? "rgba(var(--color-8), 1)" : seat?.color,
                              color: select === `${n}${j + 1}` ? "rgba(var(--color-0), 1)" : "rgba(var(--color-primary), 1)",
                              cursor: selectAble ? "pointer" : "no-drop"
                            }}
                            className={[styles.tdInner, select === `${n}${j + 1}` && styles.tdInnerSelected].join(" ")}
                          >
                            {
                              name ? name : `${n}${j + 1}`
                            }
                          </td>
                        );
                      })
                    }
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
		
      <div className={[styles.box, styles.btnBox].join(" ")}>
        {
          myStayData ? (
            <>
              <div className={styles.btnBoxCont}>{myStayData.seat === "#0" ? "교실" : `좌석 ${myStayData.seat}에`} 잔류 신청이 완료되었습니다!</div>
              {isOpened && <div className={[styles.btnBoxCont, styles.btnBoxCont1].join(" ")}>잔류 취소 시, 외출 및 금귀 신청 내역이 함께 삭제됩니다.</div>}
              <input
                type="button"
                className={styles.btn}
                value={isOpened ? "잔류 신청 취소" : "잔류 신청 기간이 끝났습니다."}
                disabled={!isOpened}
                style={{ cursor: isOpened ? "pointer" : "no-drop", opacity: isOpened ? 1 : 0.5 }}
                onClick={cancle}
              />
            </>
          ) : (
            <>
              {
                isClassStay ?
                  <div className={styles.btnBoxCont}>좌석을 선택하지 않으면 교실로 선택됩니다!</div>
                  :
                  <div className={styles.btnBoxCont}>잔류 할 열람실 좌석을 선택해 주세요!</div>
              }
              <input
                type="button"
                className={styles.btn}
                value={isOpened ? "잔류 신청하기" : "잔류(외출) 신청 기간이 끝났습니다."}
                disabled={!isOpened}
                style={{ cursor: isOpened ? "pointer" : "no-drop", opacity: isOpened ? 1 : 0.5 }}
                onClick={submit}
              />
            </>
          )
        }
      </div>

      <div className={styles.box}>
        <table className={styles.nameTable}>
          <tbody className={styles.tbody}>
            {
              Array(3).fill(0).map((_, i) => {
                const gradeMany = {
                  male: 0,
                  female: 0
                };
                try{
                  return (
                    <>
                      {
                        Array(6).fill(0).map((_, j) => {
                          const many = studentList[i + 1][j + 1].male.length + studentList[i + 1][j + 1].female.length;
                          gradeMany.male += studentList[i + 1][j + 1].male.length;
                          allMany.male += studentList[i + 1][j + 1].male.length;
                          gradeMany.female += studentList[i + 1][j + 1].female.length;
                          allMany.female += studentList[i + 1][j + 1].female.length;
                          return (
                            <>
                              <tr key={i * 10 + (2 * j - 1)} className={styles.trBoxN}>
                                <td className={styles.tdClass}>{i + 1}-{j + 1}</td>
                                <td className={styles.tdNum}>{many}</td>
                                <td className={styles.tdType}>남</td>
                                <td className={styles.tdPerson}>{studentList[i + 1][j + 1].male.join(" ")}</td>
                              </tr>
                              <tr key={i * 10 + j * 2} className={styles.trBoxN}>
                                <td className={styles.tdClass}></td>
                                <td className={styles.tdNum}></td>
                                <td className={styles.tdType}>여</td>
                                <td className={styles.tdPerson}>{studentList[i + 1][j + 1].female.join(" ")}</td>
                              </tr>
                            </>
                          );
                        })
                      }
                      <tr key={3 * i - 2} className={styles.trBoxN}>
                        <td className={styles.tdClass}>총계</td>
                        <td className={styles.tdNum}>{gradeMany.male}</td>
                        <td className={styles.tdType}>남</td>
                        <td className={styles.tdPerson}></td>
                      </tr>
                      <tr key={3 * i - 1} className={styles.trBoxN}>
                        <td className={styles.tdClass}></td>
                        <td className={styles.tdNum}>{gradeMany.female}</td>
                        <td className={styles.tdType}>여</td>
                        <td className={styles.tdPerson}></td>
                      </tr>
                      <tr key={3 * i} className={styles.trBoxN}>
                        <td className={styles.tdClass}></td>
                        <td className={styles.tdNum}>{gradeMany.male + gradeMany.female}</td>
                        <td className={styles.tdType}>총계</td>
                        <td className={styles.tdPerson}></td>
                      </tr>
                    </>
                  );
                } catch{ return null; }
              })
            }
            <tr className={styles.trBoxN}>
              <td className={styles.tdClass}>전체총계</td>
              <td className={styles.tdNum}>{allMany.male}</td>
              <td className={styles.tdType}>남</td>
              <td className={styles.tdPerson}></td>
            </tr>
            <tr className={styles.trBoxN}>
              <td className={styles.tdClass}></td>
              <td className={styles.tdNum}>{allMany.female}</td>
              <td className={styles.tdType}>여</td>
              <td className={styles.tdPerson}></td>
            </tr>
            <tr className={styles.trBoxN}>
              <td className={styles.tdClass}></td>
              <td className={styles.tdNum}>{allMany.male + allMany.female}</td>
              <td className={styles.tdType}>총계</td>
              <td className={styles.tdPerson}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}