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

const BASE_URL = "https://bharataqi.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "BharatAQI — Satellite-Powered Air Quality Intelligence",
    template: "%s | BharatAQI",
  },
  description:
    "AI-powered air quality intelligence for India. Real-time AQI predictions, " +
    "HCHO hotspot mapping, and 48-hour forecasts derived from Sentinel-5P TROPOMI, " +
    "MODIS, and ERA5 satellite data fused with a Hybrid CNN-LSTM deep learning model.",
  keywords: [
    "AQI India", "air quality India", "satellite AQI", "HCHO hotspot",
    "Sentinel-5P", "TROPOMI", "CNN-LSTM", "CPCB", "PM2.5 forecast",
    "BharatAQI", "ISRO", "deep learning air quality",
  ],
  authors: [{ name: "BharatAQI Team" }],
  creator: "BharatAQI",
  robots: { index: true, follow: true },
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "BharatAQI",
    title: "BharatAQI — Satellite-Powered Air Quality Intelligence",
    description:
      "Real-time AQI predictions and HCHO hotspot mapping for all 36 Indian states " +
      "using Sentinel-5P TROPOMI satellite data and a Hybrid CNN-LSTM model.",
    images: [
      {
        url: `${BASE_URL}/assets/background.png`,
        width: 1200,
        height: 630,
        alt: "BharatAQI — India Air Quality Intelligence Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BharatAQI — Satellite-Powered Air Quality Intelligence",
    description:
      "Real-time AQI predictions and HCHO hotspot mapping for India using satellite data.",
    images: [`${BASE_URL}/assets/background.png`],
  },
  other: {
    "theme-color": "#03050a",
  },
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
