import type { Metadata, Viewport } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import MannersGate from "@/components/MannersGate";
import "./globals.css";

const zen = Zen_Maru_Gothic({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-zen", display: "swap" });

const DESCRIPTION = "楽器の練習ができる場所を、条件とマナーつきで地図に共有するサービス。無料・見るだけならログイン不要。";

export const metadata: Metadata = {
  metadataBase: new URL("https://street-sound-map-frontend.vercel.app"),
  title: "Street Sound Map（SSM）",
  description: DESCRIPTION,
  // Twitter（X）などで URL を貼った時の見え方
  openGraph: {
    title: "Street Sound Map（SSM）",
    description: DESCRIPTION,
    url: "/",
    siteName: "Street Sound Map",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "迷惑をかけずに練習できる場所を、みんなで地図に。" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
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
