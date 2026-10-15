"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MarketCard } from './ui/MarketCard';

gsap.registerPlugin(ScrollTrigger);

export function Marketplace() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const market = gsap.timeline({
      scrollTrigger: { trigger: container.current, start: 'top top', end: '+=135%', pin: true, scrub: 1.1 }
    });
    
    market.from('.market-copy > *', { x: -70, opacity: 0, stagger: 0.12, duration: 0.65 })
          .from('.m1', { x: 220, y: 90, rotate: 12, opacity: 0, duration: 0.85 }, 0.25)
          .from('.m2', { x: -180, y: 50, rotate: -10, opacity: 0, duration: 0.85 }, 0.42)
          .from('.m3', { x: 140, y: 180, rotate: 8, opacity: 0, duration: 0.85 }, 0.6)
          .from('.live-pill', { y: 30, opacity: 0, duration: 0.5 }, 0.8)
          .to('.market-field', { scale: 1.25, rotate: 20, duration: 1.4 }, 1);
          
    gsap.to('.m1', { y: -45, rotate: -1, ease: 'none', scrollTrigger: { trigger: container.current, start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
    gsap.to('.m2', { y: 70, rotate: 7, ease: 'none', scrollTrigger: { trigger: container.current, start: 'top bottom', end: 'bottom top', scrub: 1.4 } });
    gsap.to('.m3', { y: -80, rotate: -4, ease: 'none', scrollTrigger: { trigger: container.current, start: 'top bottom', end: 'bottom top', scrub: 1.6 } });
  }, { scope: container });

  return (
    <section ref={container} className="marketplace scene bg-[#edf5ef] min-h-screen relative overflow-hidden grid grid-cols-1 lg:grid-cols-[41%_59%] items-center pt-[110px] pb-[80px] lg:py-[150px] px-[22px] lg:px-[max(6vw,72px)]" id="marketplace">
      <div className="market-copy max-w-[550px] relative z-4 mb-[40px] lg:mb-0">
        <div className="eyebrow text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase">THE MARKETPLACE</div>
        <h2 className="font-manrope text-[54px] lg:text-[clamp(62px,6.7vw,110px)] leading-[0.9] tracking-[-0.075em] mt-[25px]">
          Real assets.<br/>Defined <span className="text-[#008b45]">returns.</span>
        </h2>
        <p className="max-w-[500px] text-[17px] leading-[1.55] text-[#65716b] my-[30px]">
          Discover verified land plots, short-cycle commodity trading contracts, and structured land banking. Compare terms, choose your return plan, and track everything directly from your portfolio.
        </p>
        <div className="pills flex flex-wrap gap-[8px]">
          <span className="border border-[rgba(0,139,69,0.25)] bg-white/60 px-[14px] py-[8px] rounded-full text-[12px] font-semibold text-[#1e4a2c]">Commodity Trading (5% – 20%)</span>
          <span className="border border-[rgba(0,139,69,0.25)] bg-white/60 px-[14px] py-[8px] rounded-full text-[12px] font-semibold text-[#1e4a2c]">Freehold Land</span>
          <span className="border border-[rgba(0,139,69,0.25)] bg-white/60 px-[14px] py-[8px] rounded-full text-[12px] font-semibold text-[#1e4a2c]">Land Banking</span>
        </div>
      </div>
      
      <div className="market-visual h-[520px] lg:h-[650px] relative">
        <div className="market-field absolute w-[620px] h-[620px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#d3e9d8_0,#e6f1e8_45%,transparent_70%)]" />
        
        <MarketCard className="m1 left-[-5%] lg:left-[6%] top-[7%] lg:top-[10%] -rotate-5 w-[245px] lg:w-[320px]" photoClass="bg-[url('/assets/images/tomato-trading.jpg')] bg-cover bg-center h-[160px] lg:h-[205px]" category="COMMODITY" title="Tomato Trading" location="Ogun & Lagos Distribution" priceOrReturn="5% – 20%" />
        <MarketCard className="m2 right-[-5%] lg:right-[5%] top-[29%] rotate-5 w-[245px] lg:w-[320px]" photoClass="bg-[url('/assets/images/land-plots.jpg')] bg-cover bg-center h-[160px] lg:h-[205px]" category="LAND" title="Ilewo Orile Plot" location="Abeokuta, Ogun State" priceOrReturn="₦500,000" />
        <MarketCard className="m3 left-[8%] lg:left-[24%] bottom-0 lg:bottom-[2%] -rotate-2 w-[245px] lg:w-[320px]" photoClass="bg-[url('/assets/images/pepper-trading.jpg')] bg-cover bg-center h-[160px] lg:h-[205px]" category="COMMODITY" title="Pepper Trading" location="30 – 90 Days Cycle" priceOrReturn="Fixed Payout" />
        
        <div className="live-pill absolute right-[2%] lg:right-[13%] bottom-0 lg:bottom-[2%] bg-[#0d2016] text-white rounded-full px-[16px] py-[11px] text-[11px] font-bold flex gap-[8px] items-center shadow-lg">
          <i className="w-[8px] h-[8px] bg-[#36bf76] rounded-full shadow-[0_0_0_4px_rgba(54,191,118,0.25)]" /> Verified Assets Active
        </div>
      </div>
    </section>
  );
}
