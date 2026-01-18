import type { Metadata } from "next";
import { Pretendard } from "next/font/google";
import { Providers } from "./providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const pretendard = Pretendard({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pretendard",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BookBean - 온라인 서점",
  description: "도서를 판매하는 온라인 서점, 따뜻한 책 한 잔 BookBean",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className={pretendard.className + " min-h-screen flex flex-col"}>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
