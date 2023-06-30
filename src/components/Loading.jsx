import React, { useEffect, useState } from "react";

import styles from "&/Loading.module.css";

const Loading = ({show}) => {
  return show && (
    <div className={styles.box}>
      <span className={styles.loader}></span>
      <div>로딩중...</div>
    </div>
  );
};

export default Loading;