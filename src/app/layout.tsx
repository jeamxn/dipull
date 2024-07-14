/* eslint-disable @next/next/no-img-element */
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { headers } from "next/headers";
import React from "react";

import RecoilProvider from "@/provider/RecoilProvider";
import ToastProvider from "@/provider/ToastProvider";

import Darkmode from "./Darkmode";
import Loading from "./loading";

export const generateMetadata = async (): Promise<Metadata> => {
  const x_origin = headers().get("x-origin") || process.env.NEXT_PUBLIC_DIMIGOIN_URI || "";
  return {
    title: "디풀",
    description: "한국디지털미디어고등학교 인트라넷의 새 이름, 디풀. (디미고인 풀 서비스)",
    openGraph:{
      title: "디풀",
      siteName: "디풀",
      description: "한국디지털미디어고등학교 인트라넷의 새 이름, 디풀. (디미고인 풀 서비스)",
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
    },
    appleWebApp: true,
    icons: [
      { 
        "url": "/favicon.ico", 
        "type": "image/x-icon", 
        "sizes": "16x16 32x32"
      },
      { 
        "url": "/public/icons/icon-192.png", 
        "type": "image/png", 
        "sizes": "192x192"
      },
      { 
        "url": "/public/icons/icon-512.png", 
        "type": "image/png", 
        "sizes": "512x512"
      },
        
    ],
    manifest: "/manifest.json",
    metadataBase: new URL(x_origin)
  };
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="kr">
      <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width"/>
      <meta name="apple-mobile-web-app-capable" content="yes"/>
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fafaff"/>
      <meta name="theme-color" media="(prefers-color-scheme: dark)"  content="#000000"/>
      <meta name="google-adsense-account" content="ca-pub-7372688315698125" />
      <link rel="apple-touch-icon" href="/public/icons/apple-touch-icon.png" />
      <body>
        <RecoilProvider>
          <ToastProvider>
            <main className=" min-h-[calc(100vh-3.5rem)]">
              {children}
            </main>
            <Loading />
          </ToastProvider>
        </RecoilProvider>
        <Darkmode />
        <Analytics />
        <GoogleAnalytics gaId="G-1X4669WKHE" />
      </body>
    </html>
  );
};

export default RootLayout;