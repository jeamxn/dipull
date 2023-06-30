import React, { useEffect, useState } from "react";

import styles from "&/Loading.module.css";

const Loading = ({show}) => {
  return show && (
    <div className={styles.box}>
      <div className={styles.boxInner}>
        <span className={styles.loader}></span>
        <div className={styles.title}>로딩중...</div>
      </div>
    </div>
  );
};

export default Loading;