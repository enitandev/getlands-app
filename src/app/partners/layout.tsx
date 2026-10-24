import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Partner & Agent Network | Earn Up to 10% Commission",
  description: "Join the Getlands Partner Network as a certified real estate and financial sales agent. Help your clients co-invest in verified physical land and high-yield agricultural commodity cycles.",
  alternates: {
    canonical: "/partners",
  },
  openGraph: {
    title: "Partner & Agent Network | Getlands",
    description: "Earn up to 10% direct commissions and build recurring referral income with Getlands Real-Asset Marketplace.",
    url: "https://getlands.ng/partners",
  },
};

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
