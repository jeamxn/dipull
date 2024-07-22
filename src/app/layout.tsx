import { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import React from "react";

import Navigation from "@/components/Navigation";
import RecoilProvider from "@/components/provider/RecoilProvider";

import Loading from "./loading";

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
    metadataBase: new URL(x_origin)
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="w-full h-full overflow-x-hidden flex flex-col bg-background">
      <meta name="viewport" content="initial-scale=1, viewport-fit=cover"/>
      <body className="w-full h-full overflow-x-hidden flex flex-row bg-background justify-around max-md:gap-0 gap-10 py-safe-or-0 px-safe-offset-16 max-md:px-safe-or-0">
        {/* 컴퓨터 화면 */}
        <main className="max-md:hidden flex flex-col justify-center">
          <div className="flex flex-col gap-6 max-[650px]:items-center max-[650px]:justify-center max-[650px]:w-full">
            <div className="flex flex-col gap-4 w-full max-[650px]:justify-center">
              <div className="flex flex-row gap-3 items-center max-[650px]:justify-center">
                <svg width="35" height="35" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1115_161)">
                    <path className="fill-text/80" d="M26.8382 18.3641C27.7759 19.3018 29.0477 19.8286 30.3738 19.8286H55.1723C57.9338 19.8286 60.1724 22.0671 60.1724 24.8286V49.6272C60.1724 50.9533 60.6991 52.2251 61.6368 53.1628L71.4654 62.9913C74.6152 66.1411 80.0009 63.9103 80.0009 59.4558V5C80.0009 2.23857 77.7623 0 75.0009 0H20.5452C16.0907 0 13.8598 5.38571 17.0097 8.53553L26.8382 18.3641Z" />
                    <path className="fill-text/80" d="M53.1628 61.6368C52.2251 60.6991 50.9533 60.1724 49.6272 60.1724H24.8286C22.0672 60.1724 19.8286 57.9338 19.8286 55.1724V30.3738C19.8286 29.0477 19.3018 27.7759 18.3641 26.8382L8.53554 17.0097C5.38572 13.8598 0 16.0907 0 20.5452V75.0009C0 77.7624 2.23858 80.0009 5 80.0009H59.4558C63.9103 80.0009 66.1412 74.6152 62.9913 71.4654L53.1628 61.6368Z" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1115_161">
                      <rect width="80" height="80" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <p className="text-5xl text-text/80 whitespace-nowrap max-[650px]:text-center font-bold">Dipull</p>
              </div>
              <p className="text-2xl text-text/60 font-medium break-words max-[650px]:text-center leading-normal animation-main">기상송, 세탁/건조, 잔류 신청까지 모두!</p>
            </div>
          </div>
        </main> 
        <RecoilProvider>
          <main className="max-md:hidden flex flex-col border-x border-text/5 dark:border-text/20 w-128 h-full bg-white relative">
            {children}
            <Navigation />
          </main> 
          {/* 모바일 화면 */}
          <main className="max-md:flex hidden flex-col w-full h-full bg-white relative">
            {children}
            <Navigation />
          </main>
          <Loading />
        </RecoilProvider>
      </body>
    </html>
  );
}
