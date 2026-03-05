import type { Metadata } from "next";
import "./globals.css";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Gen-da | 한국 K-팝업, 수 시간 만에",
  description: "글로벌 스몰 브랜드의 한국 팝업을 위한 원스톱 자동화 플랫폼.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ paddingTop: 48 }}>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
