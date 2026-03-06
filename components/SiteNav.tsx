"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteNav() {
  const path = usePathname();
  const isDashboard = path === "/dashboard";

  // 랜딩페이지는 자체 Navbar 사용 → SiteNav 미표시
  if (path === "/") return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
      background: "#fff",
      borderBottom: "1px solid #e2e8f0",
      boxShadow: "0 1px 4px rgba(0,0,0,.06)",
    }}>
      <div style={{
        maxWidth: 1600, margin: "0 auto",
        padding: "0 20px", height: 48,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>

        {/* 로고 */}
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: 8,
          textDecoration: "none",
        }}>
          <div style={{
            width: 28, height: 28, background: "#4f46e5", borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 900, fontSize: 13,
          }}>G</div>
          <span style={{ fontSize: 15, fontWeight: 900, color: "#0f172a" }}>Gen-da</span>
        </Link>

        {/* 페이지 탭 */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Link href="/" style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 8,
            fontSize: 13, fontWeight: 600, textDecoration: "none",
            background: !isDashboard ? "#4f46e5" : "#f1f5f9",
            color:      !isDashboard ? "#fff"    : "#475569",
            border: "none", transition: "all .15s",
          }}>
            🚀 랜딩페이지
          </Link>

          <Link href="/dashboard" style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 8,
            fontSize: 13, fontWeight: 600, textDecoration: "none",
            background: isDashboard ? "#4f46e5" : "#f1f5f9",
            color:      isDashboard ? "#fff"    : "#475569",
            border: "none", transition: "all .15s",
          }}>
            🗂 관제탑
          </Link>

          <Link href="/report" style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 8,
            fontSize: 13, fontWeight: 600, textDecoration: "none",
            background: path === "/report" ? "#e11d48" : "#f1f5f9",
            color:      path === "/report" ? "#fff"    : "#475569",
            border: "none", transition: "all .15s",
          }}>
            📰 리포트
          </Link>
        </div>

        {/* 베타 CTA */}
        <Link href="/#beta" style={{
          padding: "6px 16px", borderRadius: 8,
          background: "#4f46e5", color: "#fff",
          fontSize: 12, fontWeight: 700, textDecoration: "none",
        }}>
          베타 신청 →
        </Link>
      </div>
    </div>
  );
}
