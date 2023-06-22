import Head from "next/head";
import Image from "next/image";
import React from "react";

import styles from "%/Home.module.css";
import DefaultHead from "@/components/DefaultHead";


export default function Home() {
  return (
    <>
      <DefaultHead></DefaultHead>
      <main className={styles.main}>
        
      </main>
    </>
  );
}
