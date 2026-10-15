"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FarmCard } from './ui/FarmCard';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export function Farms({ plans }: { plans?: any[] }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const farms = gsap.timeline({
      scrollTrigger: { trigger: container.current, start: 'top top', end: '+=130%', pin: true, scrub: 1.05 }
    });
    
    farms.from('.farms-head > *', { x: -55, opacity: 0, stagger: 0.12, duration: 0.65 })
         .from('.farm-card', { y: 150, opacity: 0, rotate: i => i === 1 ? 0 : i === 0 ? -3 : 3, stagger: 0.16, duration: 1 }, 0.25)
         .from('.farm-note', { y: 20, opacity: 0, duration: 0.45 }, 0.85);
         
    gsap.utils.toArray('.farm-card').forEach((card: any, i) => {
      gsap.to(card, {
        y: i === 0 ? -20 : (i === 1 ? 35 : -25),
        ease: 'none',
        scrollTrigger: { trigger: container.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
      });
    });
  }, { scope: container });

  return (
    <section ref={container} className="farms scene bg-[#f7f9f7] min-h-screen relative overflow-hidden py-[110px] lg:py-[145px] px-[22px] lg:px-[max(6vw,72px)]" id="commodities">
      <div className="farms-head block lg:flex justify-between items-end mb-[55px]">
        <div>
          <div className="eyebrow text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase">SHORT-CYCLE COMMODITY TRADING</div>
          <h2 className="font-manrope text-[54px] lg:text-[clamp(60px,7vw,108px)] leading-[0.88] tracking-[-0.075em] my-[20px]">
            High-demand crops.<br/><span className="text-[#008b45]">Defined returns.</span>
          </h2>
          <p className="text-[16px] text-[#68736e] m-0 max-w-[560px]">
            Participate in wholesale agricultural commodity aggregation and distribution. Choose flexible 30-day (5%), 60-day (12%), or 90-day (20%) return plans.
          </p>
        </div>
        <Link href="/explore" className="inline-block mt-[20px] lg:mt-0 text-ink text-[12px] font-bold no-underline hover:text-[#008b45] transition-colors">
          Browse all commodity cycles ↗
        </Link>
      </div>
      
      <div className="farm-cards grid grid-cols-1 lg:grid-cols-3 gap-[18px]">
        <FarmCard 
          className="h-[470px] lg:h-[520px]"
          photoClass="bg-[url('/assets/images/tomato-trading.jpg')] bg-cover bg-center"
          cycle="30 – 90 DAYS" crop="TOMATO" title="Tomato Commodity Trading" location="Ogun & Lagos Wholesale"
          plans={plans} price="₦100,000" targetReturn="5% – 20%"
        />
        <FarmCard 
          className="h-[470px] lg:h-[520px]"
          photoClass="bg-[url('/assets/images/pepper-trading.jpg')] bg-cover bg-center"
          cycle="30 – 90 DAYS" crop="PEPPER" title="Scotch Bonnet Trading" location="South-West Distribution"
          plans={plans} price="₦100,000" targetReturn="5% – 20%"
        />
        <FarmCard 
          className="h-[470px] lg:h-[520px]"
          photoClass="bg-[url('/assets/images/garri-trading.jpg')] bg-cover bg-center"
          cycle="30 – 90 DAYS" crop="GARRI & GRAIN" title="Yellow Garri Wholesale" location="Warehouse Aggregation"
          plans={plans} price="₦100,000" targetReturn="5% – 20%"
        />
      </div>
      
      <div className="farm-note mt-[22px] flex items-center justify-between text-[#7c8681] text-[11px] flex-wrap gap-2">
        <span>Capital and returns are automatically credited to your verified wallet upon maturity.</span>
        <span className="font-bold text-[#008b45]">100% Contractually Guaranteed</span>
      </div>
    </section>
  );
}
