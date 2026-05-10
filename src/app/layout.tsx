import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import ScrollReset from "@/components/ScrollReset";
import "./globals.css";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ngô Hồ Tấn Toàn | IT Student & Web Developer",
  description:
    "Personal portfolio of Ngô Hồ Tấn Toàn — IT Student & Web Developer specializing in modern web technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${robotoMono.variable}`}
    >
      <body className="min-h-screen bg-[#0a0a0a] text-slate-200 antialiased bg-grid-pattern">
        <ScrollReset />
        {children}
      </body>
    </html>
  );
}
