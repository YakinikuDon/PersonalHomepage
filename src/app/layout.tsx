import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.yakinikudon.top"),
  title: "Dong Yizhou (董一舟) | Project Management & DX Expert",
  description: "Dong Yizhou (董一舟) - Project Management & Digital Transformation (DX) Expert at JGC Global / 日挥全球. PMP certified professional optimizing engineering operations through Generative AI & automation.",
  alternates: {
    canonical: "https://www.yakinikudon.top",
  },
  openGraph: {
    title: "Dong Yizhou (董一舟) | Project Management & DX Expert",
    description: "Dong Yizhou (董一舟) - Project Management & Digital Transformation (DX) Expert at JGC Global / 日挥全球. PMP certified professional optimizing engineering operations through Generative AI & automation.",
    url: "https://www.yakinikudon.top",
    siteName: "Dong Yizhou Portfolio",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/avatar_luffy.jpg",
        width: 800,
        height: 800,
        alt: "Dong Yizhou Profile Picture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dong Yizhou (董一舟) | Project Management & DX Expert",
    description: "Dong Yizhou (董一舟) - Project Management & Digital Transformation (DX) Expert at JGC Global / 日挥全球. PMP certified professional optimizing engineering operations through Generative AI & automation.",
    images: ["/avatar_luffy.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
