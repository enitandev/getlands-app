"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Trust() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.trust-copy > *', { x: -55, opacity: 0, stagger: 0.12, duration: 0.7, scrollTrigger: { trigger: container.current, start: 'top 68%', toggleActions: 'play none none reverse' } });
    gsap.from('.trust-grid > div', { x: 60, opacity: 0, stagger: 0.12, duration: 0.65, scrollTrigger: { trigger: container.current, start: 'top 62%', toggleActions: 'play none none reverse' } });
  }, { scope: container });

  return (
    <section ref={container} className="trust scene bg-white min-h-screen relative overflow-hidden grid grid-cols-1 lg:grid-cols-[43%_57%] items-center py-[110px] lg:py-[150px] px-[22px] lg:px-[max(6vw,72px)]">
      <div className="trust-copy">
        <div className="eyebrow text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase">THE TRUST LAYER</div>
        <h2 className="font-manrope text-[54px] lg:text-[clamp(60px,6.7vw,104px)] leading-[0.9] tracking-[-0.075em] my-[22px]">
          Know the asset.<br/><span className="text-[#008b45]">Know the terms.</span>
        </h2>
        <p className="text-[17px] text-[#68736d] max-w-[520px] leading-[1.55]">
          Every opportunity should make the important information easy to see before you commit.
        </p>
      </div>
      
      <div className="trust-grid grid grid-cols-1 lg:grid-cols-2 lg:border-t border-line mt-[55px] lg:mt-0">
        <div className="p-[28px_28px_30px_0] border-b border-line grid grid-cols-[45px_1fr] gap-x-[15px] gap-y-[4px]">
          <b className="row-span-2 text-[#008b45] text-[12px] font-bold">01</b>
          <strong className="font-manrope text-[20px] tracking-[-0.03em]">Title & Survey Verification</strong>
          <span className="text-[13px] text-[#76817b] leading-relaxed">Every land plot is beacon-pegged, perimeter-surveyed, and backed by a genuine Deed of Assignment and official Allocation Letter.</span>
        </div>
        <div className="p-[28px_28px_30px_0] border-b border-line grid grid-cols-[45px_1fr] gap-x-[15px] gap-y-[4px]">
          <b className="row-span-2 text-[#008b45] text-[12px] font-bold">02</b>
          <strong className="font-manrope text-[20px] tracking-[-0.03em]">Physical Produce Backing</strong>
          <span className="text-[13px] text-[#76817b] leading-relaxed">Commodity trading cycles are secured by physical inventory, verified aggregation hubs, and pre-negotiated institutional off-taker contracts.</span>
        </div>
        <div className="p-[28px_28px_30px_0] border-b border-line grid grid-cols-[45px_1fr] gap-x-[15px] gap-y-[4px]">
          <b className="row-span-2 text-[#008b45] text-[12px] font-bold">03</b>
          <strong className="font-manrope text-[20px] tracking-[-0.03em]">Defined Return Plans</strong>
          <span className="text-[13px] text-[#76817b] leading-relaxed">Fixed 30, 60, or 90-day cycles offering 5%, 12%, or 20% returns. Zero hidden deductions, documented in legal subscription agreements.</span>
        </div>
        <div className="p-[28px_28px_30px_0] border-b border-line grid grid-cols-[45px_1fr] gap-x-[15px] gap-y-[4px]">
          <b className="row-span-2 text-[#008b45] text-[12px] font-bold">04</b>
          <strong className="font-manrope text-[20px] tracking-[-0.03em]">Instant Wallet Settlements</strong>
          <span className="text-[13px] text-[#76817b] leading-relaxed">Automated ledger crediting on maturity date. Withdraw your capital and profit straight to your verified Nigerian bank account at any time.</span>
        </div>
      </div>
    </section>
  );
}
