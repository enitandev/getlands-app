"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from './ui/Button';

gsap.registerPlugin(ScrollTrigger);

export function Closing() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.closing-copy > *', { y: 55, opacity: 0, stagger: 0.12, duration: 1, ease: 'power4.out', scrollTrigger: { trigger: container.current, start: 'top 72%', toggleActions: 'play none none reverse' } });
    gsap.to('.closing-image', { scale: 1.14, y: -30, ease: 'none', scrollTrigger: { trigger: container.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
  }, { scope: container });

  return (
    <section ref={container} className="closing scene bg-[#07110b] min-h-[85vh] lg:min-h-screen relative overflow-hidden grid place-items-center text-center px-[22px]">
      <div className="closing-image absolute inset-0 bg-[url('https://www.climatechangeauthority.gov.au/sites/default/files/istock-1329114139.jpg')] bg-center bg-cover scale-[1.06]" />
      <div className="closing-overlay absolute inset-0 bg-gradient-to-b from-[rgba(3,12,7,0.68)] to-[rgba(3,12,7,0.72)] bg-[radial-gradient(circle_at_50%_45%,rgba(0,139,69,0.28),transparent_55%)]" />
      
      <div className="closing-copy relative z-2 text-white">
        <img src="/assets/getlands-logo.png" alt="Getlands" className="w-[150px] lg:w-[190px] brightness-0 invert mx-auto mb-[38px] lg:mb-[55px]" />
        <div className="eyebrow text-[12px] tracking-[0.14em] font-extrabold uppercase text-[#a1dfb5]">THE NEW GETLANDS</div>
        <h2 className="font-manrope text-[54px] lg:text-[clamp(65px,8.2vw,130px)] leading-[0.88] tracking-[-0.08em] my-[20px]">
          Find your next<br/><span className="text-[#82dc9f]">opportunity.</span>
        </h2>
        <p className="text-[15px] lg:text-[17px] text-[#c0ccc5] my-[28px] lg:my-[34px]">
          Land. Farms. Structured opportunities. One marketplace.
        </p>
        <div><Button href="/explore" variant="primary">Explore Getlands ↗</Button></div>
      </div>
    </section>
  );
}
