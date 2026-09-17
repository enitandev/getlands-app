"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Shift() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const shift = gsap.timeline({
      scrollTrigger: { trigger: container.current, start: 'top top', end: '+=135%', pin: true, scrub: 1.15 }
    });
    
    shift.from('.shift-inner .eyebrow', { y: 35, opacity: 0, duration: 0.5 })
         .from('.shift h2', { y: 100, opacity: 0, duration: 1 }, 0.15)
         .from('.flow-mini', { y: 40, opacity: 0, duration: 0.7 }, 0.5)
         .from('.shift p', { y: 25, opacity: 0, duration: 0.5 }, 0.7)
         .to('.shift h2', { scale: 1.13, opacity: 0.12, duration: 1.2 }, 1.35);
  }, { scope: container });

  return (
    <section ref={container} className="shift scene dark bg-dark text-white min-h-screen relative overflow-hidden grid place-items-center text-center px-[22px]" id="how">
      <div className="shift-inner w-[min(1250px,90vw)]">
        <div className="eyebrow text-[12px] tracking-[0.14em] font-extrabold text-[#809088] uppercase mb-[35px]">THE NEXT PHASE</div>
        <h2 className="font-manrope text-[54px] lg:text-[clamp(64px,8.3vw,138px)] leading-[0.88] tracking-[-0.08em] font-semibold m-0">
          From buying land<br/>to managing <span className="text-[#008b45]">ownership.</span>
        </h2>
        <div className="flow-mini flex items-center justify-center gap-[13px] lg:gap-[28px] my-[60px] lg:my-[85px] mb-[25px] lg:mb-[28px] flex-wrap">
          <b className="text-[10px] tracking-[0.12em]">01 DISCOVER</b>
          <i className="hidden lg:block w-[55px] h-[1px] bg-white/17" />
          <b className="text-[10px] tracking-[0.12em]">02 ACQUIRE</b>
          <i className="hidden lg:block w-[55px] h-[1px] bg-white/17" />
          <b className="text-[10px] tracking-[0.12em]">03 MANAGE</b>
          <i className="hidden lg:block w-[55px] h-[1px] bg-white/17" />
          <b className="text-[10px] tracking-[0.12em]">04 TRANSFER</b>
          <i className="hidden lg:block w-[55px] h-[1px] bg-white/17" />
          <b className="text-[10px] tracking-[0.12em]">05 EXIT</b>
        </div>
        <p className="text-[#7c8982] text-[12px]">The marketplace starts with discovery. The product grows with what you can do after ownership.</p>
      </div>
    </section>
  );
}
