/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import "./globals.css";
import React from "react";


export const metadata: Metadata = {
  title: "디미고인 풀 서비스 V3",
  description: "그래그래 드디어 왔다 디미고인 풀 서비스 V3",
  openGraph:{
    title: "디미고인 풀 서비스 V3",
    siteName: "디미고인 풀 서비스 V3",
    description: "그래그래 드디어 왔다 디미고인 풀 서비스 V3",
    type: "website",
    url: "https://dimigo.net",
    locale: "ko_KR",
    images: [
      {
        url: "https://dimigo.net/public/og-image.png",
        width: 4800,
        height: 2520,
      }
    ],
  }
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="kr">
      <body>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;