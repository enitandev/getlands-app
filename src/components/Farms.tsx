"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FarmCard } from './ui/FarmCard';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export function Farms() {
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
    <section ref={container} className="farms scene bg-[#f7f9f7] min-h-screen relative overflow-hidden py-[110px] lg:py-[145px] px-[22px] lg:px-[max(6vw,72px)]" id="farms">
      <div className="farms-head block lg:flex justify-between items-end mb-[55px]">
        <div>
          <div className="eyebrow text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase">FARM OPPORTUNITIES</div>
          <h2 className="font-manrope text-[54px] lg:text-[clamp(60px,7vw,108px)] leading-[0.88] tracking-[-0.075em] my-[20px]">
            Let the land<br/><span className="text-[#008b45]">work, too.</span>
          </h2>
          <p className="text-[16px] text-[#68736e] m-0">Different crops. Different cycles. One place to discover them.</p>
        </div>
        <Link href="/explore" className="inline-block mt-[20px] lg:mt-0 text-ink text-[11px] font-bold no-underline hover:underline">Browse all farms ↗</Link>
      </div>
      
      <div className="farm-cards grid grid-cols-1 lg:grid-cols-3 gap-[18px]">
        <FarmCard 
          className="h-[470px] lg:h-[520px]"
          photoClass="bg-[url('https://images.unsplash.com/photo-1608737637507-9aaeb9f4bf30?auto=format&fit=crop&fm=jpg&q=90&w=1400')]"
          cycle="4 MONTHS" crop="PEPPER" title="Pepper Farm" location="Ogun State"
          targetReturn="25%" price="₦100,000"
        />
        <FarmCard 
          className="h-[470px] lg:h-[520px]"
          photoClass="bg-[url('https://images.unsplash.com/photo-1723234870945-c4c4a9e2c683?auto=format&fit=crop&fm=jpg&q=90&w=1400')]"
          cycle="5 MONTHS" crop="TOMATO" title="Tomato Farm" location="Kaduna State"
          targetReturn="30%" price="₦100,000"
        />
        <FarmCard 
          className="h-[470px] lg:h-[520px]"
          photoClass="bg-[url('https://images.unsplash.com/photo-1757283961570-682154747d9c?auto=format&fit=crop&fm=jpg&q=90&w=1400')]"
          cycle="6 MONTHS" crop="CASSAVA" title="Cassava Farm" location="Ogun State"
          targetReturn="35%" price="₦100,000"
        />
      </div>
      
      <div className="farm-note mt-[18px] text-[#7c8681] text-[10px]">Terms and outcomes vary by opportunity.</div>
    </section>
  );
}
