import type { Metadata } from "next";
import { Nunito, Poppins, Roboto } from "next/font/google";
import ReactQueryProvider from "./react-query-provider";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "leaflet/dist/leaflet.css";
import "@mantine/carousel/styles.css";

import { MantineProvider } from "@mantine/core";
import { ReduxProvider } from "./redux/provider";
import React from "react";
import { ModalsProvider } from "@mantine/modals";
import Script from "next/script";
import SessionRestore from "./components/SessionRestore";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: [
    "100", "200", "300", "400", "500", "600", "700", "800", "900",
  ],
  variable: "--font-poppins",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "shikshapay | Best ERP for school finance management",
    template: "%s",
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
    <html
      lang="en"
      className={`${nunito.variable} ${poppins.variable} ${roboto.variable}`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DCCMSKS911"
          strategy="lazyOnload"
        />

        <Script id="google-analytics" strategy="lazyOnload">
          {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-DCCMSKS911');
    `}
        </Script>
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
            fontFamily:
              "var(--font-nunito), var(--font-poppins), Greycliff CF, Verdana, sans-serif",
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
                <SessionRestore />

                {children}
              </ModalsProvider>
            </ReactQueryProvider>
          </ReduxProvider>
        </MantineProvider>
      </body>
    </html>
  );
}