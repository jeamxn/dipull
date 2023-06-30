import React from "react";

import styles from "&/MealTime.module.css";

const MealTime = ({when, data}) => {
  return (
    <div className={styles.mealInfo}>
      <div className={styles.mealInfoTitle}>{when}</div>
      <div className={styles.mealInfoContent}>
        {
          data ? data.split("/").map((meal, index) => (
            <div key={index}>- {meal}</div>
          )) : (
            <div>급식 정보가 없습니다.</div>
          )
        }
      </div>
    </div>
  );
};

export default MealTime;