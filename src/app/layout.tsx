import type { Metadata } from "next";
import { Inter, Sora, Orbitron } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BharatAQI - Satellite-Powered Air Quality Intelligence",
  description: "Leveraging satellite observations, meteorology, and deep learning for high-resolution AQI maps and HCHO hotspot analysis in India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-[#03050a]">
      <body
        className={`${inter.variable} ${sora.variable} ${orbitron.variable} ${geistMono.variable} antialiased text-white bg-[#03050a] min-h-screen overflow-x-hidden font-body`}
      >
        {children}
      </body>
    </html>
  );
}
