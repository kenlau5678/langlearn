import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LangLearn",
  description: "轻量的个人英语学习工具",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
