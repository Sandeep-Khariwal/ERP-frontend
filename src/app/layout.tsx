import type { Metadata } from "next";
import ReactQueryProvider from "./react-query-provider";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import 'leaflet/dist/leaflet.css';
import "@mantine/carousel/styles.css";

import { MantineProvider } from "@mantine/core";
import { ReduxProvider } from "./redux/provider";
import React from "react";
import { ModalsProvider } from "@mantine/modals";
import Script from "next/script";
import SessionRestore from "./components/SessionRestore";



export const metadata: Metadata = {
  title: {
    default: "shikshapay | Best ERP for school finance management",
    template: "%s"
  },

  description: "Best - ERP software for records management",

  verification: {
    google: "puizxPp3UZNG7RVIzfXSuwCx2Jsp1OVkssyBS19kSbM",
  },

  icons: {
    icon: [
      {
        rel: "icon",
        url: "/logo1.png",
      },
      {
        rel: "apple-touch-icon",
        url: "/next.svg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DCCMSKS911"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-DCCMSKS911');
    `}
        </Script>
        {/* Roboto font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />

        {/* poppins fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />

        {/* Nunito font  */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MantineProvider
          theme={{
            colors: {
              customBlue: [
                "#E8EDFF",
                "#D0DBFF",
                "#B8C9FF",
                "#A0B7FF",
                "#88A5FF",
                "#7093FF",
                "#5881FF",
                "#406FFF",
                "#285DFF",
                "#104BFF",
              ],
            },
            fontFamily: "Nunito,Poppins,Greycliff CF, Verdana, sans-serif",
            fontFamilyMonospace: "Greycliff CF, Monaco, Courier, monospace",
            components: {
              Modal: {
                defaultProps: {
                  closeOnClickOutside: false,
                },
              },
            },
          }}
        >
          <ReduxProvider>
  <ReactQueryProvider>
    <ModalsProvider>
      <React.StrictMode>
        <SessionRestore />

        {children}
      </React.StrictMode>
    </ModalsProvider>
  </ReactQueryProvider>
</ReduxProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
