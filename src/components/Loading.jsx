import React from "react";

import styles from "&/Loading.module.css";

const Loading = ({show}) => {
  return show && (
    <div className={styles.box}>
      <div className={styles.ldsripple}><div></div><div></div></div>
      {/* <div className={styles["sk-folding-cube"]}>
        <div className={[styles["sk-cube1"], styles["sk-cube"]].join(" ")}></div>
        <div className={[styles["sk-cube2"], styles["sk-cube"]].join(" ")}></div>
        <div className={[styles["sk-cube4"], styles["sk-cube"]].join(" ")}></div>
        <div className={[styles["sk-cube3"], styles["sk-cube"]].join(" ")}></div>
      </div> */}
    </div>
  );
};

export default Loading;