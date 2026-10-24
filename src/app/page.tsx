import { Hero } from "@/components/Hero";
import { Shift } from "@/components/Shift";
import { Marketplace } from "@/components/Marketplace";
import { Ways } from "@/components/Ways";
import { Farms } from "@/components/Farms";
import { LandBanking } from "@/components/LandBanking";
import { Portfolio } from "@/components/Portfolio";
import { Trust } from "@/components/Trust";
import { Faq } from "@/components/Faq";
import { Closing } from "@/components/Closing";
import { Footer } from "@/components/Footer";

import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const plans = await prisma.returnPlan.findMany({
    orderBy: { sortOrder: 'asc' }
  });

  return (
    <main id="top">
      <Hero />
      <Shift />
      <Marketplace />
      <Ways />
      <Farms plans={plans} />
      <LandBanking />
      <Portfolio />
      <Trust />
      <Faq />
      <Closing />
      <Footer />
    </main>
  );
}
