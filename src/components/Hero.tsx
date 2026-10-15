"use client";
import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from './ui/Button';
import { HeroCard } from './ui/HeroCard';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <Link className="brand block w-[120px] lg:w-[143px]" href="#top">
          <img src="/assets/getlands-logo.png" alt="Getlands" className="w-full block" />
        </Link>

        {/* Desktop Navbar */}
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 gap-[4px] p-[5px] bg-white/85 backdrop-blur-[22px] border border-black/5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <Link href="/explore" className="px-[16px] py-[10px] rounded-full text-[#18201c] text-[13px] font-medium hover:bg-[#eef3ef] transition-colors">Marketplace</Link>
          <a href="#commodities" className="px-[16px] py-[10px] rounded-full text-[#18201c] text-[13px] font-medium hover:bg-[#eef3ef] transition-colors">Commodity Trading</a>
          <a href="#how" className="px-[16px] py-[10px] rounded-full text-[#18201c] text-[13px] font-medium hover:bg-[#eef3ef] transition-colors">How it works</a>
          <Link href="/partners" className="px-[16px] py-[10px] rounded-full text-[#008b45] text-[13px] font-bold hover:bg-[#008b45]/10 transition-colors">Partners & Agents</Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-[8px] lg:gap-[10px]">
          <Link href="/login" className="hidden sm:block px-[16px] py-[9px] lg:py-[11px] rounded-full text-[#18201c] text-[13px] font-bold bg-white/85 backdrop-blur-[22px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:bg-[#eef3ef] transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="bg-[#008b45] hover:bg-[#007339] text-white text-[13px] font-bold px-[16px] lg:px-[22px] py-[9px] lg:py-[12px] rounded-full no-underline transition-all shadow-[0_10px_25px_rgba(0,139,69,0.25)]">
            Get started
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden w-[40px] h-[40px] rounded-full bg-white/90 border border-black/5 flex items-center justify-center text-ink"
            aria-label="Toggle navigation menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[75px] left-4 right-4 z-90 bg-white/95 backdrop-blur-[20px] rounded-[24px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-black/5 animate-in slide-in-from-top-4 flex flex-col gap-3">
          <Link onClick={() => setMobileMenuOpen(false)} href="/explore" className="px-4 py-3 rounded-xl hover:bg-[#eef3ef] text-[15px] font-bold text-ink">Explore Marketplace</Link>
          <a onClick={() => setMobileMenuOpen(false)} href="#commodities" className="px-4 py-3 rounded-xl hover:bg-[#eef3ef] text-[15px] font-bold text-ink">Commodity Trading</a>
          <a onClick={() => setMobileMenuOpen(false)} href="#how" className="px-4 py-3 rounded-xl hover:bg-[#eef3ef] text-[15px] font-bold text-ink">How it Works</a>
          <Link onClick={() => setMobileMenuOpen(false)} href="/partners" className="px-4 py-3 rounded-xl bg-[#008b45]/10 text-[#008b45] text-[15px] font-bold">Partners & Agent Network</Link>
          <div className="pt-3 border-t border-line flex gap-2">
            <Link onClick={() => setMobileMenuOpen(false)} href="/login" className="flex-1 py-3 text-center border border-line rounded-xl text-[14px] font-bold">Sign In</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/register" className="flex-1 py-3 text-center bg-[#008b45] text-white rounded-xl text-[14px] font-bold">Register</Link>
          </div>
        </div>
      )}

      <div className="hero-left relative z-5">
        <div className="text-[12px] tracking-[0.14em] font-extrabold uppercase text-[#4f5c55] mb-[24px]">REAL-ASSET PLATFORM · NIGERIA</div>
        <h1 className="font-manrope text-[52px] lg:text-[clamp(64px,7.2vw,120px)] leading-[0.9] tracking-[-0.075em] font-semibold m-0">
          Find your next<br/><span className="text-[#008b45]">opportunity.</span>
        </h1>
        <p className="text-[16px] lg:text-[18px] leading-[1.5] text-[#66716c] my-[30px] max-w-[520px]">
          Verified freehold land, short-cycle commodity trading, and structured land banking. Direct allocations, defined returns, 100% physically backed.
        </p>
        <div className="hero-buttons flex flex-col sm:flex-row gap-[12px] items-stretch sm:items-start">
          <Button href="/explore" variant="primary">Explore opportunities <b>↗</b></Button>
          <Button href="#how" variant="secondary">See how it works</Button>
        </div>
      </div>

      <div className="hero-visual h-[490px] lg:h-[min(720px,76vh)] mt-[45px] lg:mt-0 relative">
        <div className="hero-image absolute right-[-4%] lg:right-0 top-[7%] w-[90%] lg:w-[75%] h-[74%] lg:h-[76%] rounded-[34px] overflow-hidden shadow-[0_40px_90px_rgba(22,55,36,0.16)] rotate-2 before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#f5f8f5a6] before:to-transparent before:to-[35%] after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:from-[50%] after:to-[rgba(0,0,0,0.18)]">
          <img src="/assets/images/hero-farmland.jpg" alt="Demarcated Land and Agriculture in Ogun State" className="w-full h-full object-cover saturate-[0.95] contrast-[1.02]" />
        </div>
        
        <div className="hero-glow absolute w-[75%] h-[75%] right-[2%] top-[10%] rounded-full bg-[radial-gradient(circle,rgba(91,186,120,0.18),transparent_66%)] blur-[12px]" />
        
        <div className="hero-orbit absolute border border-[rgba(0,139,69,0.16)] rounded-full left-[47%] top-[48%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[37%] -rotate-20" />
        <div className="hero-orbit absolute border border-[rgba(0,139,69,0.16)] rounded-full left-[47%] top-[48%] -translate-x-1/2 -translate-y-1/2 w-[105%] h-[52%] rotate-[28deg]" />
        <div className="hero-orbit absolute border border-[rgba(0,139,69,0.16)] rounded-full left-[47%] top-[48%] -translate-x-1/2 -translate-y-1/2 w-[115%] h-[70%] -rotate-[42deg]" />
        
        <HeroCard className="hero-card hc1 right-[-5%] lg:right-0 top-[7%] lg:top-[11%] rotate-[4deg]" category="COMMODITY" location="TOMATO TRADING" title="5% – 20% Returns" priceOrReturn="30 – 90 Days" statusLabel="Distribution Hub" statusValue="Open" />
        <HeroCard className="hero-card hc2 right-[1%] lg:right-[13%] bottom-[19%] -rotate-[4deg]" category="LAND" location="ILEWO ORILE" title="60 × 120 FT" priceOrReturn="₦500,000" statusLabel="Ogun State" statusValue="Title Verified" />
        <HeroCard className="hero-card hc3 left-[-6%] lg:left-[5%] bottom-0 lg:bottom-[2%] rotate-[2deg]" category="LAND BANKING" location="ABEOKUTA EXT." title="Structured Growth" priceOrReturn="12-Month Exit" statusLabel="Allocation" statusValue="Guaranteed" />
      </div>

      <div className="hero-stats relative lg:absolute left-auto lg:left-[max(6vw,72px)] bottom-auto lg:bottom-[30px] mt-[25px] lg:mt-0 grid grid-cols-2 lg:flex lg:gap-0 gap-[14px] lg:border-t lg:border-line lg:pt-[14px]">
        <div className="lg:pr-[35px] lg:mr-[35px] pr-[15px] mr-[15px] border-r border-line">
          <b className="block font-manrope text-[18px]">30 – 90 Days</b>
          <span className="text-[10px] text-[#75807a]">Flexible Trade Cycles</span>
        </div>
        <div className="lg:pr-[35px] lg:mr-[35px] lg:border-r border-line border-r-0">
          <b className="block font-manrope text-[18px]">5% – 20%</b>
          <span className="text-[10px] text-[#75807a]">Defined Return Plans</span>
        </div>
        <div className="lg:pr-[35px] lg:mr-[35px] lg:border-r border-line border-r-0">
          <b className="block font-manrope text-[18px]">100%</b>
          <span className="text-[10px] text-[#75807a]">Physically Backed Assets</span>
        </div>
        <div>
          <b className="block font-manrope text-[18px]">₦0 Fees</b>
          <span className="text-[10px] text-[#75807a]">Direct Allocation</span>
        </div>
      </div>

      <div className="scroll-indicator hidden lg:flex absolute right-[max(6vw,72px)] bottom-[35px] text-[10px] text-[#7b8580] items-center gap-[8px]">
        <span className="w-[6px] h-[6px] rounded-full bg-[#008b45]" /> Scroll to explore
      </div>
    </section>
  );
}
