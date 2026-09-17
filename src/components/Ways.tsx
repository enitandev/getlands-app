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
          bgClass="bg-[url('https://miro.medium.com/1%2AUdsTTEukqmn2iYn9w6PoYA.jpeg')] before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(3,13,7,0.05)] before:to-[rgba(3,13,7,0.72)]"
          number="01" action="OWN" title="Land"
          description="Acquire real land in strategic locations for your future."
          href="/explore" linkText="Explore land ↗"
        />
        <WayCard 
          className="h-[500px] lg:h-[560px]"
          bgClass="bg-[url('https://images.unsplash.com/photo-1723234870945-c4c4a9e2c683?auto=format&fit=crop&fm=jpg&q=85&w=1400')] before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(3,13,7,0.02)] before:to-[rgba(3,13,7,0.72)]"
          number="02" action="GROW" title="Farms"
          description="Participate in managed agricultural cycles with defined terms."
          href="/explore" linkText="Explore farms ↗"
        />
        <WayCard 
          className="h-[500px] lg:h-[560px]"
          bgClass="bg-[url('https://www.climatechangeauthority.gov.au/sites/default/files/istock-1329114139.jpg')] before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(3,13,7,0.02)] before:to-[rgba(3,13,7,0.74)]"
          number="03" action="HOLD" title="Land banking"
          description="Structured opportunities around land acquisition and holding."
          href="/explore" linkText="View opportunities ↗"
        />
      </div>
    </section>
  );
}
