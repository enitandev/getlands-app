import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Client & Investor Login",
  description: "Access your Getlands investor portfolio, track active agricultural commodity trading cycles, view land allocation deeds, and request bank withdrawals.",
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
