import type { Metadata, Viewport } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/ui/Toast";
import PWARegistration from "@/components/PWARegistration";
import GlobalAnnouncementBanner from "@/components/announcements/GlobalAnnouncementBanner";
import AnnouncementModal from "@/components/announcements/AnnouncementModal";
import { OrganizationJsonLd, WebSiteJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { getActiveAnnouncements } from "@/app/actions/announcements";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

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

export const viewport: Viewport = {
  themeColor: "#008b45",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Prevents zooming on inputs in iOS
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://getlands.ng';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Getlands | Physical Land & Agricultural Commodity Marketplace Nigeria",
    template: "%s | Getlands",
  },
  description: "Invest in verified freehold land, managed short-cycle agricultural commodity trading (garri, pepper, tomato), and high-yield land banking across Nigeria. 100% physically backed real assets with direct bank payouts.",
  keywords: [
    "real estate nigeria",
    "buy verified land in nigeria",
    "agricultural investment nigeria",
    "farmland for sale ogun state",
    "ibeju lekki land for sale",
    "commodity trading nigeria",
    "garri aggregation investment",
    "pepper commodity trading",
    "tomato farm investment nigeria",
    "land banking lagos",
    "diaspora investment in nigeria real estate",
    "verified deed of assignment land nigeria",
    "passive income farmland nigeria",
    "getlands nigeria",
    "getlands"
  ],
  authors: [{ name: "Getlands Limited", url: APP_URL }],
  creator: "Getlands Limited",
  publisher: "Getlands Limited",
  applicationName: "Getlands",
  category: "Finance & Real Estate",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: APP_URL,
    title: "Getlands | Physical Land & Agricultural Commodity Marketplace Nigeria",
    description: "Verified freehold land, short-cycle commodity trading, and structured land banking. 100% physically backed real assets with defined quarterly returns.",
    siteName: "Getlands",
    images: [{
      url: "/assets/images/hero-farmland.jpg",
      width: 1200,
      height: 630,
      alt: "Getlands Real-Asset Marketplace Nigeria",
      type: "image/jpeg",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Getlands | Physical Land & Agricultural Commodity Marketplace Nigeria",
    description: "Verified freehold land, short-cycle commodity trading, and structured land banking in Nigeria.",
    creator: "@getlands_ng",
    images: ["/assets/images/hero-farmland.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Getlands",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: [
      { url: '/assets/pwa/apple-touch-icon.png' },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let bannerAnnouncement: any = null;
  let modalAnnouncement: any = null;

  try {
    const session = await getSession();
    const role = (session?.role as string) || null;
    let kycStatus: string | null = null;
    let hasMissingBank = false;

    if (session?.userId) {
      const u = await prisma.user.findUnique({
        where: { id: session.userId as string },
        select: { kycStatus: true, bankName: true, accountNumber: true, bankAccounts: { select: { id: true }, take: 1 } },
      });
      if (u) {
        kycStatus = u.kycStatus;
        hasMissingBank = (!u.accountNumber || !u.bankName) && (!u.bankAccounts || u.bankAccounts.length === 0);
      }
    }

    const [banners, modals] = await Promise.all([
      getActiveAnnouncements({ userId: session?.userId as string, userRole: role, kycStatus, hasMissingBank, placement: 'top_banner' }),
      getActiveAnnouncements({ userId: session?.userId as string, userRole: role, kycStatus, hasMissingBank, placement: 'modal_popup' }),
    ]);
    bannerAnnouncement = banners[0] || null;
    modalAnnouncement = modals[0] || null;
  } catch (err) {
    // Graceful fallback
  }

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${manrope.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-paper text-ink overflow-x-hidden" suppressHydrationWarning>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <FaqJsonLd />
        <div className="grain pointer-events-none fixed inset-0 z-[100] opacity-[0.025]" />
        <ToastContainer />
        <PWARegistration />
        <GlobalAnnouncementBanner announcement={bannerAnnouncement} />
        <AnnouncementModal announcement={modalAnnouncement} />
        {children}
      </body>
    </html>
  );
}
