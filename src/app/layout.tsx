import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Getlands | Premium Real-Asset Marketplace",
  description: "Discover verified land, fractional farm cycles, and high-yield land banking opportunities. The smartest way to build your real-asset portfolio in Nigeria.",
  keywords: ["real estate", "nigeria", "land", "farms", "investment", "land banking", "agriculture"],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://getlands.com",
    title: "Getlands | Premium Real-Asset Marketplace",
    description: "Discover verified land, fractional farm cycles, and high-yield land banking opportunities.",
    siteName: "Getlands",
    images: [{
      url: "/assets/og-image.jpg", // Placeholder for actual OG image
      width: 1200,
      height: 630,
      alt: "Getlands Real-Asset Marketplace"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Getlands | Premium Real-Asset Marketplace",
    description: "Discover verified land, fractional farm cycles, and high-yield land banking opportunities.",
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
      className={`${dmSans.variable} ${manrope.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-paper text-ink overflow-x-hidden" suppressHydrationWarning>
        <div className="grain pointer-events-none fixed inset-0 z-[100] opacity-[0.025]" />
        {children}
      </body>
    </html>
  );
}
