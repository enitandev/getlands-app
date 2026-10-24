import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create an Account | Start Investing in Physical Real Assets",
  description: "Create your free Getlands account. Start co-investing in verified freehold land, high-yield commodity trading, and structured land banking across Nigeria.",
  alternates: {
    canonical: "/register",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
