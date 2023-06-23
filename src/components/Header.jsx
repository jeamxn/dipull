import React from "react";

import styles from "&/Header.module.css";

const Header = () => {

  return (
    <div className={styles.header}>
      <div></div>
      <div className={styles.title}>
				디미고인 풀 서비스 V2
      </div>
      <div></div>
    </div>
  );
};

export default Header;