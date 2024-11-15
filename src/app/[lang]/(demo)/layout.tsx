"use client";

import Footer from "@/components/PlatformFooter";
import Header from "@/components/PlatformHeader";
import ScrollToTop from "@/components/ScrollToTop";
// import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import "@/styles/index.css";
import "@/styles/prism-vsc-dark-plus.css";
import ToasterContext from "@/components/context/ToasetContex";
import { useEffect, useState } from "react";
import PreLoader from "@/components/Common/PreLoader";

interface LangParams {
  lang: string;
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: LangParams;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html
      suppressHydrationWarning={true}
      className="!scroll-smooth"
      lang={params.lang}
    >
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        {loading ? (
          <PreLoader />
        ) : (
          // <SessionProvider>
          <ThemeProvider
            attribute="class"
            enableSystem={false}
            defaultTheme="light"
          >
            <ToasterContext />
            <Header lang={params.lang} />

            <div className="mt-20">{children}</div>
            <Footer lang={params.lang} />
            <ScrollToTop />
          </ThemeProvider>
          // </SessionProvider>
        )}
      </body>
    </html>
  );
}
