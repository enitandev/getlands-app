"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WayCard } from './ui/WayCard';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export function Ways() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ways = gsap.timeline({
      scrollTrigger: { trigger: container.current, start: 'top 75%', end: 'bottom 35%', scrub: 1 }
    });
    
    ways.from('.ways-head > *', { y: 45, opacity: 0, stagger: 0.15, duration: 0.7 })
        .from('.way', { y: 100, opacity: 0, stagger: 0.15, duration: 0.8 }, 0.25);
        
    gsap.utils.toArray('.way').forEach((card: any, i) => {
      gsap.to(card.querySelector('.way-bg'), {
        y: i === 1 ? -25 : i === 0 ? 18 : -12,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
      });
    });
  }, { scope: container });

  return (
    <section ref={container} className="ways scene dark bg-dark text-white min-h-screen relative overflow-hidden py-[110px] lg:py-[135px] px-[22px] lg:px-[max(6vw,72px)]">
      <div className="ways-head block lg:flex justify-between items-end mb-[50px]">
        <div>
          <div className="eyebrow text-[12px] tracking-[0.14em] font-extrabold text-[#819088] uppercase mb-[20px]">THREE WAYS TO PARTICIPATE</div>
          <h2 className="font-manrope text-[54px] lg:text-[clamp(58px,6.5vw,100px)] leading-[0.9] tracking-[-0.07em] m-0">
            One platform.<br/><span className="text-[#008b45]">More possibilities.</span>
          </h2>
        </div>
        <Link href="/explore" className="inline-block mt-[25px] lg:mt-0 text-[#b6c1bb] no-underline text-[11px] font-bold">Explore all opportunities ↗</Link>
      </div>
      
      <div className="ways-grid grid grid-cols-1 lg:grid-cols-3 gap-[16px]">
        <WayCard 
          className="h-[500px] lg:h-[560px]"
          bgClass="bg-[url('/assets/images/land-plots.jpg')] bg-cover bg-center before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(3,13,7,0.1)] before:to-[rgba(3,13,7,0.8)]"
          number="01" action="OWN" title="Verified Land"
          description="Acquire vetted freehold and farmland plots with authentic survey documentation, instant physical allocation, and zero land-grabber interference."
          href="/explore" linkText="Explore land ↗"
        />
        <WayCard 
          className="h-[500px] lg:h-[560px]"
          bgClass="bg-[url('/assets/images/tomato-trading.jpg')] bg-cover bg-center before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(3,13,7,0.05)] before:to-[rgba(3,13,7,0.8)]"
          number="02" action="TRADE" title="Commodity Trading"
          description="Participate in high-turnover agricultural commodity trade cycles (Tomato, Pepper, Garri, Onions) with automated 30, 60, or 90-day return plans yielding 5%, 12%, or 20%."
          href="/explore" linkText="Explore trading cycles ↗"
        />
        <WayCard 
          className="h-[500px] lg:h-[560px]"
          bgClass="bg-[url('/assets/images/hero-farmland.jpg')] bg-cover bg-center before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(3,13,7,0.05)] before:to-[rgba(3,13,7,0.8)]"
          number="03" action="BANK" title="Land Banking"
          description="Secure high-growth land holdings at pre-development prices with contractual, scheduled buyback valuations over 12–24 months."
          href="/explore" linkText="View land banking ↗"
        />
      </div>
    </section>
  );
}
