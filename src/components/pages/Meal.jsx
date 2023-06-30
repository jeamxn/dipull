import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import styles from "&/pages/Meal.module.css";
import MealTime from "@/components/MealTime";
import { isLoadingAtom } from "@/utils/states";

const dateToString = (date) => {
  return date.getFullYear() + "-" + (String(date.getMonth() + 1).padStart(2, "0")) + "-" + String(date.getDate()).padStart(2, "0");
};

const dayDate = ["일", "월", "화", "수", "목", "금", "토"];

const Meal = () => {
  const [loading, setLoading] = useRecoilState(isLoadingAtom);
  const [date, setDate] = useState(new Date());
  const [mealData, setMealData] = useState({
    breakfast: null,
    lunch: null,
    dinner: null
  });

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
  }, [date]);

  return (
    <div className={styles.meal}>
      <div className={styles.box}>
        <div className={styles.title}>급식 정보</div>
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
      </div>
    </div>
  );
};

export default Meal;