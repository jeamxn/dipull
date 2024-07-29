import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import Script from "next/script";
import React from "react";

import Promotion from "@/components/Promotion";
import Providers from "@/components/providers";
import RecoilProvider from "@/components/providers/RecoilProvider";
import { getServerUser } from "@/utils/server";

import Loading from "./loading";

export const fetchCache = "force-no-store";

export const generateMetadata = async (): Promise<Metadata> => {
  const x_origin = headers().get("x-origin") || "";
  const json = await import("../../public/manifest.json");
  return {
    title: json.name,
    description: json.description,
    openGraph:{
      title: json.name,
      siteName: json.name,
      description: json.description,
      type: "website",
      url: x_origin,
      locale: "ko_KR",
      images: [
        {
          url: `${x_origin}/public/og-image.png`,
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
    metadataBase: new URL(x_origin),
  };
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getServerUser();
  return (
    <html lang="ko" className="overscroll-none w-full h-full overflow-x-hidden flex flex-col bg-background dark:bg-background-dark">
      <meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
      <meta name="google-adsense-account" content="ca-pub-7372688315698125" />
      <meta name="apple-mobile-web-app-capable" content="yes"/>
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fafaff"/>
      <meta name="theme-color" media="(prefers-color-scheme: dark)"  content="#000000"/>
      <link rel="apple-touch-icon" href="/public/icons/apple-touch-icon.png" />
      
      <body className="overscroll-none w-full h-full overflow-x-hidden flex flex-row bg-background dark:bg-background-dark justify-around max-md:gap-0 gap-10 py-safe-or-0 px-safe-offset-16 max-md:px-safe-or-0">
        <RecoilProvider>
          <aside className="max-md:hidden flex flex-col justify-center">
            <Promotion userInfo={user} showLogin />
          </aside> 
          <main className="flex flex-col max-md:w-full h-full bg-background dark:bg-background-dark relative border-text/5 dark:border-text-dark/20 w-128 max-md:border-x-0">
            <Providers userInfo={user}>
              {children}
            </Providers>
            <Loading />
          </main>
        </RecoilProvider>
        <GoogleAnalytics gaId="G-1X4669WKHE" />
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7372688315698125"
          crossOrigin="anonymous"
          async
        />
      </body>
    </html>
  );
};


export default RootLayout;