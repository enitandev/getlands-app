"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from './ui/Button';
import { HeroCard } from './ui/HeroCard';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.nav', { y: -28, opacity: 0, duration: 1, ease: 'power4.out', delay: 0.1 });
    gsap.from('.hero-left > *', { y: 45, opacity: 0, duration: 1.05, stagger: 0.11, ease: 'power4.out', delay: 0.2 });
    gsap.from('.hero-card', { y: 50, opacity: 0, scale: 0.92, rotate: 0, duration: 1.1, stagger: 0.13, ease: 'power4.out', delay: 0.45 });
    gsap.from('.hero-image', { scale: 1.08, opacity: 0, duration: 1.5, ease: 'power3.out', delay: 0.2 });

    gsap.to('.hero-image', {
      y: -85, scale: 1.08, rotate: -1, ease: 'none',
      scrollTrigger: { trigger: container.current, start: 'top top', end: 'bottom top', scrub: 1.4 }
    });
    
    gsap.to('.hc1', { x: -90, y: -110, rotate: -2, ease: 'none', scrollTrigger: { trigger: container.current, start: 'top top', end: 'bottom top', scrub: 1.3 } });
    gsap.to('.hc2', { x: 70, y: -150, rotate: 4, ease: 'none', scrollTrigger: { trigger: container.current, start: 'top top', end: 'bottom top', scrub: 1.6 } });
    gsap.to('.hc3', { x: 80, y: -90, rotate: -3, ease: 'none', scrollTrigger: { trigger: container.current, start: 'top top', end: 'bottom top', scrub: 1.1 } });
    gsap.to('.hero-orbit', { rotation: '+=35', scale: 1.12, ease: 'none', scrollTrigger: { trigger: container.current, start: 'top top', end: 'bottom top', scrub: 1.8 } });
  }, { scope: container });

  return (
    <section ref={container} className="hero scene min-h-screen relative overflow-hidden bg-paper grid grid-cols-1 lg:grid-cols-[47%_53%] items-center pt-[140px] lg:pt-[130px] px-6 lg:px-[max(6vw,72px)] pb-[60px] lg:pb-[95px]" id="top">
      
      <header className="nav fixed z-90 top-[10px] lg:top-[18px] left-1/2 -translate-x-1/2 w-[calc(100%-36px)] lg:w-[min(1480px,calc(100%-72px))] h-[60px] lg:h-[68px] flex items-center justify-between">
        <a className="brand block w-[120px] lg:w-[143px]" href="#top">
          <img src="/assets/getlands-logo.png" alt="Getlands" className="w-full block" />
        </a>
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 gap-[2px] p-[5px] bg-white/78 backdrop-blur-[22px] border border-black/5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <a href="/explore" className="px-[18px] py-[11px] rounded-full text-[#18201c] text-[14px] hover:bg-[#eef3ef] transition-colors">Marketplace</a>
          <a href="#how" className="px-[18px] py-[11px] rounded-full text-[#18201c] text-[14px] hover:bg-[#eef3ef] transition-colors">How it works</a>
          <a href="#portfolio" className="px-[18px] py-[11px] rounded-full text-[#18201c] text-[14px] hover:bg-[#eef3ef] transition-colors">My Getlands</a>
        </nav>
        <div className="flex items-center gap-[10px]">
          <a href="/explore" className="hidden lg:block px-[18px] py-[11px] rounded-full text-[#18201c] text-[14px] bg-white/78 backdrop-blur-[22px] border border-black/5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:bg-[#eef3ef] transition-colors">Explore</a>
          <a href="/explore" className="bg-[#008b45] text-white text-[14px] font-bold px-[15px] lg:px-[20px] py-[11px] lg:py-[13px] rounded-full no-underline">Get started</a>
        </div>
      </header>

      <div className="hero-left relative z-5">
        <div className="text-[12px] tracking-[0.14em] font-extrabold uppercase text-[#4f5c55] mb-[28px]">A NEW KIND OF REAL-ASSET MARKETPLACE</div>
        <h1 className="font-manrope text-[56px] lg:text-[clamp(68px,7.5vw,126px)] leading-[0.88] tracking-[-0.075em] font-semibold m-0">
          Find your next<br/><span className="text-[#008b45]">opportunity.</span>
        </h1>
        <p className="text-[16px] lg:text-[18px] leading-[1.45] text-[#66716c] my-[34px]">
          Land. Farms. Structured opportunities.<br/>One marketplace.
        </p>
        <div className="hero-buttons flex flex-col lg:flex-row gap-[10px] items-start">
          <Button href="/explore" variant="primary">Explore opportunities <b>↗</b></Button>
          <Button href="#how" variant="secondary">See how it works</Button>
        </div>
      </div>

      <div className="hero-visual h-[490px] lg:h-[min(720px,76vh)] mt-[45px] lg:mt-0 relative">
        <div className="hero-image absolute right-[-4%] lg:right-0 top-[7%] w-[90%] lg:w-[75%] h-[74%] lg:h-[76%] rounded-[34px] overflow-hidden shadow-[0_40px_90px_rgba(22,55,36,0.16)] rotate-2 before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#f5f8f5a6] before:to-transparent before:to-[35%] after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:from-[50%] after:to-[rgba(0,0,0,0.18)]">
          <img src="https://miro.medium.com/1%2AUdsTTEukqmn2iYn9w6PoYA.jpeg" alt="Aerial farmland" className="w-full h-full object-cover saturate-[0.9] contrast-[1.03]" />
        </div>
        
        <div className="hero-glow absolute w-[75%] h-[75%] right-[2%] top-[10%] rounded-full bg-[radial-gradient(circle,rgba(91,186,120,0.18),transparent_66%)] blur-[12px]" />
        
        <div className="hero-orbit absolute border border-[rgba(0,139,69,0.16)] rounded-full left-[47%] top-[48%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[37%] -rotate-20" />
        <div className="hero-orbit absolute border border-[rgba(0,139,69,0.16)] rounded-full left-[47%] top-[48%] -translate-x-1/2 -translate-y-1/2 w-[105%] h-[52%] rotate-[28deg]" />
        <div className="hero-orbit absolute border border-[rgba(0,139,69,0.16)] rounded-full left-[47%] top-[48%] -translate-x-1/2 -translate-y-1/2 w-[115%] h-[70%] -rotate-[42deg]" />
        
        <HeroCard className="hero-card hc1 right-[-5%] lg:right-0 top-[7%] lg:top-[11%] rotate-[4deg]" category="LAND" location="ABEOKUTA" title="60 × 120 FT" priceOrReturn="₦500,000" statusLabel="Documentation" statusValue="Verified" />
        <HeroCard className="hero-card hc2 right-[1%] lg:right-[13%] bottom-[19%] -rotate-[4deg]" category="FARM" location="PEPPER" title="25% target return" priceOrReturn="4 month cycle" statusLabel="Ogun State" statusValue="Open" />
        <HeroCard className="hero-card hc3 left-[-6%] lg:left-[5%] bottom-0 lg:bottom-[2%] rotate-[2deg]" category="LAND" location="OGUN" title="1 ACRE" priceOrReturn="₦5,000,000" statusLabel="Available" statusValue="12 acres" />
      </div>

      <div className="hero-stats relative lg:absolute left-auto lg:left-[max(6vw,72px)] bottom-auto lg:bottom-[30px] mt-[25px] lg:mt-0 grid lg:flex grid-cols-2 lg:gap-0 gap-[12px] lg:border-t lg:border-line lg:pt-[14px]">
        <div className="lg:pr-[35px] lg:mr-[35px] pr-[15px] mr-[15px] border-r border-line">
          <b className="block font-manrope text-[18px]">30+</b>
          <span className="text-[10px] text-[#75807a]">Opportunities</span>
        </div>
        <div className="lg:pr-[35px] lg:mr-[35px] lg:border-r border-line border-r-0">
          <b className="block font-manrope text-[18px]">5</b>
          <span className="text-[10px] text-[#75807a]">States</span>
        </div>
        <div className="lg:pr-[35px] lg:mr-[35px] lg:border-r border-line border-r-0">
          <b className="block font-manrope text-[18px]">2,500+</b>
          <span className="text-[10px] text-[#75807a]">Happy investors</span>
        </div>
        <div>
          <b className="block font-manrope text-[18px]">100%</b>
          <span className="text-[10px] text-[#75807a]">Verified assets</span>
        </div>
      </div>

      <div className="scroll-indicator hidden lg:flex absolute right-[max(6vw,72px)] bottom-[35px] text-[10px] text-[#7b8580] items-center gap-[8px]">
        <span className="w-[6px] h-[6px] rounded-full bg-[#008b45]" /> Scroll to explore
      </div>
    </section>
  );
}
