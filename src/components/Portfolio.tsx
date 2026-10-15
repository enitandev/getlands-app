"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from './ui/Button';
import { HoldingRow } from './ui/HoldingRow';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export function Portfolio() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const portfolio = gsap.timeline({
      scrollTrigger: { trigger: container.current, start: 'top top', end: '+=125%', pin: true, scrub: 1.1 }
    });
    
    portfolio.from('.portfolio-copy > *', { x: -60, opacity: 0, stagger: 0.12, duration: 0.65 })
             .from('.dashboard', { x: 160, y: 100, rotate: 8, opacity: 0, duration: 1 }, 0.2)
             .from('.metrics > div', { y: 28, opacity: 0, stagger: 0.1, duration: 0.45 }, 0.72)
             .from('.holding', { x: 30, opacity: 0, stagger: 0.1, duration: 0.45 }, 0.88);
  }, { scope: container });

  return (
    <section ref={container} className="portfolio scene dark bg-dark text-white min-h-screen relative overflow-hidden grid grid-cols-1 lg:grid-cols-[40%_60%] items-center gap-[45px] lg:gap-[65px] py-[110px] lg:py-[145px] px-[22px] lg:px-[max(6vw,72px)]" id="portfolio">
      <div className="portfolio-copy relative z-3">
        <div className="eyebrow text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase">MY GETLANDS</div>
        <h2 className="font-manrope text-[54px] lg:text-[clamp(60px,6.8vw,105px)] leading-[0.88] tracking-[-0.075em] my-[22px]">
          Your assets<br/>should have a <span className="text-[#008b45]">home.</span>
        </h2>
        <p className="text-[17px] leading-[1.55] text-[#99a59e] max-w-[480px] my-[30px]">
          One unified dashboard for real land holdings, verified survey documents, active commodity trading cycles, and direct wallet payouts.
        </p>
        <div><Button href="/register" variant="light">Create your account ↗</Button></div>
      </div>
      
      <div className="dashboard bg-[#f7faf7] text-ink rounded-[23px] lg:rounded-[31px] p-[18px] lg:p-[28px] shadow-[0_45px_100px_rgba(0,0,0,0.3)] rotate-1.5 max-w-[720px] justify-self-stretch">
        <div className="dash-top flex justify-between items-center">
          <div>
            <small className="text-[9px] tracking-[0.14em] text-[#008b45] font-extrabold uppercase">MY GETLANDS DASHBOARD</small>
            <h3 className="font-manrope text-[24px] tracking-[-0.05em] my-[5px]">Welcome back.</h3>
          </div>
          <span className="avatar w-[42px] h-[42px] rounded-full bg-[#dceee2] text-[#008b45] grid place-items-center text-[11px] font-extrabold">EA</span>
        </div>
        
        <div className="metrics grid grid-cols-1 lg:grid-cols-3 gap-[10px] my-[24px]">
          <div className="bg-white border border-black/5 rounded-[18px] p-[16px]">
            <small className="block text-[9px] text-[#7a847f]">Total Portfolio</small>
            <b className="block font-manrope text-[25px] tracking-[-0.05em] my-[8px] mb-[4px]">₦2.5M</b>
            <span className="block text-[9px] text-[#7a847f]">Across 3 asset classes</span>
          </div>
          <div className="bg-white border border-black/5 rounded-[18px] p-[16px]">
            <small className="block text-[9px] text-[#7a847f]">Active Cycles</small>
            <b className="block font-manrope text-[25px] tracking-[-0.05em] my-[8px] mb-[4px]">03</b>
            <span className="block text-[9px] text-[#7a847f]">1 trade · 1 land · 1 banking</span>
          </div>
          <div className="bg-white border border-black/5 rounded-[18px] p-[16px]">
            <small className="block text-[9px] text-[#7a847f]">Verified Documents</small>
            <b className="block font-manrope text-[25px] tracking-[-0.05em] my-[8px] mb-[4px]">06</b>
            <span className="block text-[9px] text-[#7a847f]">Survey & Agreements</span>
          </div>
        </div>
        
        <div className="dash-list bg-white border border-black/5 rounded-[18px] p-[20px]">
          <header className="flex justify-between text-[#78827d] text-[9px] tracking-[0.12em] font-extrabold pb-[10px]">
            <span>YOUR HOLDINGS</span>
            <Link href="/dashboard" className="text-[#008b45] hover:underline">VIEW ALL ↗</Link>
          </header>
          <HoldingRow type="land" icon="L" title="60 × 120 Plot · Ilewo Orile" subtitle="Freehold Land · Verified" value="₦500,000" />
          <HoldingRow type="pepper" icon="T" title="Tomato Commodity Trading" subtitle="60 Days · 12% Return" value="+₦24,000" />
          <HoldingRow type="bank" icon="₦" title="Abeokuta Land Banking" subtitle="12 Months · Exit: ₦1.4M" value="₦1,000,000" />
        </div>
      </div>
    </section>
  );
}
