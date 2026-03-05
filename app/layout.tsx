import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gen-da 관제탑 | K-Popup SaaS Control Tower",
  description: "1,000명 베타 모객 목표 — Gen-da 전체 워크플로우 간트차트 관제탑",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
