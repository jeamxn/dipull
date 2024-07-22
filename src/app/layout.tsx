import { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import React from "react";

import Navigation from "@/components/Navigation";
import RecoilProvider from "@/components/provider/RecoilProvider";

import Loading from "./loading";
import Promotion from "./login/Promotion";

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
          <Promotion />
        </main> 
        <RecoilProvider>
          <main className="max-md:hidden flex flex-col border-x border-text/5 dark:border-text/20 w-128 h-full bg-background relative">
            <div className="overflow-auto pb-36 h-full">
              {children}
            </div>
            <Navigation />
          </main> 
          {/* 모바일 화면 */}
          <main className="max-md:flex hidden flex-col w-full h-full bg-background relative">
            <div className="overflow-auto pb-36 h-full">
              {children}
            </div>
            <Navigation />
          </main>
          <Loading />
        </RecoilProvider>
      </body>
    </html>
  );
}
