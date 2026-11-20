import type { Metadata, Viewport } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import MannersGate from "@/components/MannersGate";
import "./globals.css";

const zen = Zen_Maru_Gothic({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-zen", display: "swap" });

export const metadata: Metadata = {
  title: "Street Sound Map",
  description: "楽器の練習ができる場所を、地図でみんなと共有するサービス。マナーを守って使ってください。",
};

export const viewport: Viewport = {
  themeColor: "#f5efe1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={zen.variable}>
      <body className="font-sans antialiased">
        {children}
        <MannersGate />
      </body>
    </html>
  );
}
