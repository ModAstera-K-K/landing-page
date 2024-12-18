import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
// import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import "@/styles/index.css";
import "@/styles/prism-vsc-dark-plus.css";
import ToasterContext from "@/components/context/ToasetContex";

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
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="light"
        >
          <ToasterContext />
          <Header lang={params.lang} />
          {children}
          <Footer lang={params.lang} />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
