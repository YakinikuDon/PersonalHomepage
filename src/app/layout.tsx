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
  title: "Dongyizhou | Senior Full-Stack Engineer & AI Agent Developer",
  description: "Explore Dongyizhou's senior engineering portfolio. Features an interactive career timeline, showcase projects, and a secure LLM recruiter match score calculator.",
  alternates: {
    canonical: "https://www.yakinikudon.top",
  },
  openGraph: {
    title: "Dongyizhou | Senior Full-Stack Engineer & AI Agent Developer",
    description: "Explore Dongyizhou's senior engineering portfolio. Features an interactive career timeline, showcase projects, and a secure LLM recruiter match score calculator.",
    url: "https://www.yakinikudon.top",
    siteName: "Dongyizhou Portfolio",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/avatar_luffy.jpg",
        width: 800,
        height: 800,
        alt: "Dongyizhou Profile Picture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dongyizhou | Senior Full-Stack Engineer & AI Agent Developer",
    description: "Explore Dongyizhou's senior engineering portfolio. Features an interactive career timeline, showcase projects, and a secure LLM recruiter match score calculator.",
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
