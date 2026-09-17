"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Future() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const future = gsap.timeline({
      scrollTrigger: { trigger: container.current, start: 'top top', end: '+=120%', pin: true, scrub: 1.1 }
    });
    
    future.from('.future-inner > *', { y: 65, opacity: 0, stagger: 0.12, duration: 0.65 })
          .from('.future-flow > div', { scale: 0.7, opacity: 0, stagger: 0.1, duration: 0.45 }, 0.4)
          .from('.future-flow > i', { scaleX: 0, transformOrigin: 'left center', stagger: 0.1, duration: 0.35 }, 0.5)
          .to('.future h2', { scale: 1.08, duration: 1 }, 1.2);
  }, { scope: container });

  return (
    <section ref={container} className="future scene dark bg-dark text-white min-h-screen relative overflow-hidden grid place-items-center text-center py-[110px] lg:py-[150px] px-[22px] lg:px-[max(6vw,72px)]">
      <div className="future-inner w-[min(1350px,100%)]">
        <div className="eyebrow text-[12px] tracking-[0.14em] font-extrabold text-[#819088] uppercase mb-[34px]">THE NEXT PHASE</div>
        <h2 className="font-manrope text-[54px] lg:text-[clamp(64px,8.4vw,138px)] leading-[0.88] tracking-[-0.08em] m-0">
          From buying land<br/>to managing <span className="text-[#008b45]">ownership.</span>
        </h2>
        
        <div className="future-flow flex items-center justify-center flex-wrap my-[60px] lg:my-[90px] mb-[25px] lg:mb-[30px] gap-[16px] lg:gap-0">
          <div className="flex flex-col gap-[8px] min-w-[72px] lg:min-w-[105px]">
            <small className="text-[9px] text-[#64736b]">01</small>
            <b className="text-[11px] tracking-[0.12em] text-[#8de1a9]">DISCOVER</b>
          </div>
          <i className="hidden lg:block w-[60px] h-[1px] bg-white/17" />
          <div className="flex flex-col gap-[8px] min-w-[72px] lg:min-w-[105px]">
            <small className="text-[9px] text-[#64736b]">02</small>
            <b className="text-[11px] tracking-[0.12em]">ACQUIRE</b>
          </div>
          <i className="hidden lg:block w-[60px] h-[1px] bg-white/17" />
          <div className="flex flex-col gap-[8px] min-w-[72px] lg:min-w-[105px]">
            <small className="text-[9px] text-[#64736b]">03</small>
            <b className="text-[11px] tracking-[0.12em]">MANAGE</b>
          </div>
          <i className="hidden lg:block w-[60px] h-[1px] bg-white/17" />
          <div className="flex flex-col gap-[8px] min-w-[72px] lg:min-w-[105px]">
            <small className="text-[9px] text-[#64736b]">04</small>
            <b className="text-[11px] tracking-[0.12em]">TRANSFER</b>
          </div>
          <i className="hidden lg:block w-[60px] h-[1px] bg-white/17" />
          <div className="flex flex-col gap-[8px] min-w-[72px] lg:min-w-[105px]">
            <small className="text-[9px] text-[#64736b]">05</small>
            <b className="text-[11px] tracking-[0.12em]">EXIT</b>
          </div>
        </div>
        
        <p className="text-[12px] text-[#7c8982]">The marketplace starts with discovery. The product grows with what you can do after ownership.</p>
      </div>
    </section>
  );
}
