import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import React from "react";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
      <Analytics />
    </RecoilRoot>
  );
}
