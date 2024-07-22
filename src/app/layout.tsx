import { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import React from "react";

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
      <body className="w-full h-full overflow-x-hidden flex flex-col bg-background p-safe-or-0">
        {children}
      </body>
    </html>
  );
}
