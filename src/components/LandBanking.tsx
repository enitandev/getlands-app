"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BankCard } from './ui/BankCard';
import { Button } from './ui/Button';

gsap.registerPlugin(ScrollTrigger);

export function LandBanking() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const bank = gsap.timeline({
      scrollTrigger: { trigger: container.current, start: 'top top', end: '+=120%', pin: true, scrub: 1.1 }
    });
    
    bank.from('.bank-copy > *', { x: -65, opacity: 0, stagger: 0.12, duration: 0.65 })
        .from('.bank-photo', { scale: 1.15, opacity: 0, duration: 1 }, 0.15)
        .from('.bank-card', { x: 170, y: 50, rotate: 10, opacity: 0, duration: 1 }, 0.35)
        .to('.bank-card', { y: -28, rotate: -1, duration: 0.8 }, 1.05);
  }, { scope: container });

  return (
    <section ref={container} className="landbank scene bg-[#edf4ef] min-h-screen relative overflow-hidden grid grid-cols-1 lg:grid-cols-[43%_57%] items-center py-[110px] lg:py-[145px] px-[22px] lg:px-[max(6vw,72px)]" id="landbank">
      <div className="bank-bg absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(0,139,69,0.12),transparent_40%)]" />
      
      <div className="bank-copy relative z-3">
        <div className="eyebrow text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase">LAND BANKING</div>
        <h2 className="font-manrope text-[54px] lg:text-[clamp(64px,7.2vw,112px)] leading-[0.88] tracking-[-0.075em] my-[22px]">
          Put land<br/>on a <span className="text-[#008b45]">timeline.</span>
        </h2>
        <p className="max-w-[490px] text-[17px] text-[#68736d] leading-[1.55] my-[30px]">
          A structured land opportunity with a defined holding period and stated exit terms.
        </p>
        <div><Button href="/explore" variant="primary">View opportunity ↗</Button></div>
      </div>
      
      <div className="bank-visual h-[510px] lg:h-[650px] relative mt-[45px] lg:mt-0">
        <div className="bank-photo absolute inset-[7%_0_5%_5%] rounded-[34px] overflow-hidden bg-[url('https://www.climatechangeauthority.gov.au/sites/default/files/istock-1329114139.jpg')] bg-center bg-cover before:absolute before:inset-0 before:bg-gradient-to-r before:from-[rgba(238,245,239,0.9)] before:to-transparent before:to-[40%]" />
        
        <BankCard 
          className="left-[2%] lg:left-[8%] top-[28%] lg:top-[30%] w-[96%] lg:w-[500px]"
          location="ABEOKUTA" status="OPEN"
          acquireAmount="₦1,000,000" exitAmount="₦1,400,000"
          months="12" size="60 × 120 FT"
        />
      </div>
    </section>
  );
}
