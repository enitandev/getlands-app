import { Hero } from "@/components/Hero";
import { Shift } from "@/components/Shift";
import { Marketplace } from "@/components/Marketplace";
import { Ways } from "@/components/Ways";
import { Farms } from "@/components/Farms";
import { LandBanking } from "@/components/LandBanking";
import { Portfolio } from "@/components/Portfolio";
import { Trust } from "@/components/Trust";
import { Future } from "@/components/Future";
import { Closing } from "@/components/Closing";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main id="top">
      <Hero />
      <Shift />
      <Marketplace />
      <Ways />
      <Farms />
      <LandBanking />
      <Portfolio />
      <Trust />
      <Future />
      <Closing />
      <Footer />
    </main>
  );
}
