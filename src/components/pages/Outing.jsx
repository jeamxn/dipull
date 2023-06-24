import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import styles from "&/pages/Outing.module.css";
import { isLoadingAtom, userInfoAtom } from "@/utils/states";

const MealInfo = ({ when, info, meal }) => {
  return (
    <div className={styles.nowApply}>
      <div className={styles.nowApplyWhen}>{when}</div>
      <div className={styles.nowApplyCont}>{info.join(", ")}</div>
      <div className={styles.nowApplyMeal}>
        {
          ["조식", "중식", "석식"].map((item, i) => (
            <div 
              className={styles.nowApplyMealBox} 
              style={{
                backgroundColor: !meal[i] ? "rgba(var(--color-primary), .05)" : ""
              }}
              key={i}
            >
              <div className={styles.nowApplyMealTitle}>{item}</div>
              <div className={styles.nowApplyMealContent}>취소{meal[i] ? " 안함" : "함"}</div>
            </div>
          ))
        }
      </div>

    </div>
  );
};

const Outing = () => {
  const [loading, setLoading] = useRecoilState(isLoadingAtom);
  const [selected, setSelected] = useState("");
  const [outReason, setOutReason] = useState("");
  const [outTime, setOutTime] = useState(["10:20", "14:00"]);
  const [selectMeal, setSelectMeal] = useState([true, true, true]);
  const [checker, setChecker] = useRecoilState(userInfoAtom);
  const [isOpened, setIsOpened] = useState(false);

  const [data, setData] = useState(null);

  const LoadData = async () => {
    setLoading(true);
    const {data: axiosData} = await axios({
      method: "GET",
      url: "/api/outing",
    });
    setIsOpened(axiosData.isOpened);

    setData(axiosData.success ? axiosData.data : null);
    
    if(axiosData.success){
      const newChecker = { ...checker };
      if(newChecker.outing !== undefined) {
        newChecker.outing = axiosData.data["토요일"].reason.length || axiosData.data["일요일"].reason.length ? true : false;
        setChecker(newChecker);
      }
    }
    setLoading(false);
  };

  const Apply = async () => {
    if(!isOpened) return;
    setLoading(true);
    const {data: axiosData} = await axios({
      method: "POST",
      url: "/api/outing",
      data: {
        type: selected[1] === "u" ? "일요일" : "토요일",
        reason: `${outReason}(${outTime[0]}~${outTime[1]})`,
        meal: selectMeal
      }
    });
    alert(axiosData.message);
    await LoadData();
    setLoading(false);
  };

  useEffect(() => {
    LoadData();
  }, []);

  return (
    <div className={styles.outing}>
      {
        data ? (
          <>
            <div className={styles.box}>
              <div className={styles.title}>외출 신청하기</div>
              <div className={styles.selects}>
                <select 
                  className={styles.applySelect} 
                  value={selected}
                  onChange={e => {
                    setSelected(e.target.value);
                    if(e.target.value === "su-y") {
                      setOutTime(["10:20", "14:00"]);
                      setOutReason("자기계발외출");
                      const temp = [...Object.entries(data)[e.target.value[1] === "u" ? 1: 0][1].meal];
                      temp[1] = false;
                      setSelectMeal(temp);
                    }
                    else {
                      setSelectMeal(Object.entries(data)[e.target.value[1] === "u" ? 1: 0][1].meal);
                      setOutTime(["10:20", "14:00"]);
                      setOutReason("");
                    }
                  }}
                >
                  <option value="">외출 형태를 선택해 주세요.</option>
                  <optgroup label="토요일">
                    <option value="st-n">토요일 - 자기계발 외 외출</option>
                  </optgroup>
                  <optgroup label="일요일">
                    <option value="su-y">일요일 - 자기계발외출 (10:20 ~ 14:00)</option>
                    <option value="su-n">일요일 - 자기계발 외 외출</option>
                  </optgroup>
                </select>
                <input 
                  type="text"
                  className={styles.applyInput}
                  value={outReason.replaceAll(" ", "")}
                  placeholder="외출 사유를 입력해 주세요."
                  onChange={e => setOutReason(e.target.value)}
                  disabled={selected === "su-y"}
                />
                <div className={styles.times}>
                  <div className={styles.timesBox}>
                    <input 
                      type="time"
                      value={outTime[0]}
                      onChange={e => setOutTime([e.target.value, outTime[1]])}
                      className={styles.applyInputTime}
                      disabled={selected === "su-y"}
                    />
                  </div>
                  <div>~</div>
                  <div className={styles.timesBox}>
                    <input 
                      type="time"
                      value={outTime[1]}
                      onChange={e => setOutTime([outTime[0], e.target.value])}
                      className={styles.applyInputTime}
                      disabled={selected === "su-y"}
                    />
                  </div>
                </div>
                <div className={styles.nowApply}>
                  {/* <div className={styles.nowApplyWhen}>{selected[1] === "t" ? "토" : "일"}요일</div> */}
                  <div className={styles.nowApplyMeal}>
                    {
                      ["조식", "중식", "석식"].map((item, i) => (
                        <div 
                          className={styles.nowApplyMealBox} 
                          style={{
                            backgroundColor: !selectMeal[i] ? "rgba(var(--color-primary), .05)" : ""
                          }}
                          onClick={() => {
                            const temp = [...selectMeal];
                            temp[i] = !temp[i];
                            setSelectMeal(temp);
                          }}
                          key={i}
                        >
                          <div className={styles.nowApplyMealTitle}>{item}</div>
                          <div className={styles.nowApplyMealContent}>취소{selectMeal[i] ? " 안함" : "함"}</div>
                        </div>
                      ))
                    }
                  </div>

                </div>
                <input
                  type="button"
                  value={isOpened ? "외출 신청하기" : "잔류(외출) 신청 기간이 끝났습니다."}
                  className={styles.applyBtn}
                  onClick={Apply}
                  style={{
                    opacity: selected === "" || outReason === "" || outTime[0] === "" || outTime[1] === "" ? .5 : 1
                  }}
                  disabled={selected === "" || outReason === "" || outTime[0] === "" || outTime[1] === "" || !isOpened}
                />
              </div>
              
            </div>
            <div className={styles.box}>
              <div className={styles.title}>외출 신청 현황</div>
              <div className={styles.nowBox}>
                {
                  data && Object.entries(data).map((item, i) => {
                    return (
                      <MealInfo 
                        when={item[0]} 
                        info={item[1].reason.length > 0 ? item[1].reason : ["외출 신청 없음"]} 
                        meal={item[1].meal}
                        key={i}
                      />
                    );
                  })
                }
              </div>
            </div>
          </>
        ) : (
          <div className={styles.box}>
            <div className={styles.title}>외출 신청하기</div>
            <div>외출 신청은 잔류자만 가능합니다.</div>
          </div>
        )
      }
    </div>
  );
};

export default Outing;