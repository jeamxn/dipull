import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import styles from "&/pages/Meal.module.css";
import MealTime from "@/components/MealTime";
import { isLoadingAtom, myInfoAtom } from "@/utils/states";

const dateToString = (date) => {
  return date.getFullYear() + "-" + (String(date.getMonth() + 1).padStart(2, "0")) + "-" + String(date.getDate()).padStart(2, "0");
};

const dayDate = ["일", "월", "화", "수", "목", "금", "토"];

const Meal = () => {
  const [userInfo, setUserInfo] = useRecoilState(myInfoAtom);
  const [classInfo, setClassInfo] = useState([Math.floor(userInfo.number / 1000), Math.floor(userInfo.number / 100 % 10)]);
  const [loading, setLoading] = useRecoilState(isLoadingAtom);
  const [date, setDate] = useState(new Date());
  const [mealData, setMealData] = useState({
    breakfast: null,
    lunch: null,
    dinner: null
  });
  const [timetableData, setTimetableData] = useState(null);

  const LoadData = async () => {
    setLoading(true);
    try{
      const {data} = await axios({
        method: "GET",
        url: "/api/meal",
        params: {
          date: dateToString(date)
        }
      });
      setMealData(data.meal);

      const {data: timetable} = await axios({
        method: "GET",
        url: `/api/timetable/${classInfo[0]}/${classInfo[1]}`,
      });
      setTimetableData(timetable);
    }
    catch {
      setMealData({
        breakfast: null,
        lunch: null,
        dinner: null
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    LoadData();
  }, [date, classInfo]);

  return (
    <div className={styles.meal}>
      <div className={styles.box}>
        <div className={styles.title}>
          시간표
          <select 
            className={styles.titleSelect} 
            onChange={(e) => {
              const grade = Math.floor(e.target.value / 10);
              const class_ = e.target.value % 10;
              setClassInfo([grade, class_]);
            }}
          > 
            {
              Array(3).fill(0).map((_, i) => {
                return (
                  <optgroup label={`${i + 1}학년`} key={i}>
                    {
                      Array(6).fill(0).map((_, j) => (
                        <option 
                          key={j}
                          selected={classInfo[0] === i + 1 && classInfo[1] === j + 1}
                          value={(i + 1) * 10 + j + 1}
                        >
                          {i + 1}학년 {j + 1}반
                        </option>
                      ))
                    }
                  </optgroup>
                );
              })
            }
          </select>
        </div>
        <div className={styles.tableDiv}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.time}>시간</th>
                <th>월</th>
                <th>화</th>
                <th>수</th>
                <th>목</th>
                <th>금</th>
              </tr>
            </thead>
            <tbody>
              {
                timetableData ? timetableData.map((data, i) => {
                  return (
                    <tr key={i}>
                      <td className={styles.time}>{i + 1}</td>
                      {
                        data.map((item, j) => {
                          return (
                            <td key={j} className={styles.subtea}>
                              <div className={styles.sub}>{item.subject}</div>
                              <div className={styles.tea}>{item.teacher}</div>
                            </td>
                          );
                        })
                      }
                    </tr>
                  );
                }) : null
              }
            </tbody>
          </table>
        </div>

        <div className={styles.title}>급식</div>
        <div className={styles.dateTitle}>{date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}일 {dayDate[date.getDay()]}요일</div>
        <div className={styles.meals}>
          <div className={styles.mealsInner}>
            <MealTime when="아침" data={mealData.breakfast} />
            <MealTime when="점심" data={mealData.lunch} />
            <MealTime when="저녁" data={mealData.dinner} />
          </div>
        </div>
        <div className={styles.btns}>
          <div
            className={styles.btn}
            onClick={() => {
              setDate(new Date(date.getTime() - 86400000));
            }}
          >
            <Image src="/icons/prev.svg" width={20} height={20} alt="prev" />
          </div>
          <div 
            className={[styles.btn, styles.today].join(" ")}
            onClick={() => {
              setDate(new Date());
            }}
          >
            <Image src="/icons/today.svg" width={20} height={20} alt="today" />
          </div>
          <div
            className={styles.btn}
            onClick={() => {
              setDate(new Date(date.getTime() + 86400000));
            }}
          >
            <Image src="/icons/next.svg" width={20} height={20} alt="next" />
          </div>
        </div>
        <div className={styles.dimigomeal}>급식 정보 제공: <a target="_blank" href="https://디미고급식.com" rel="noreferrer">디미고급식.com</a></div>
      </div>
    </div>
  );
};

export default Meal;