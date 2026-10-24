"use client";
import React, { useState } from 'react';

const FAQ_ITEMS = [
  {
    q: "What is Getlands and how does the platform work?",
    a: "Getlands is Nigeria’s premier physical real-asset marketplace specializing in verified freehold land, managed agricultural commodity cycles, and structured land banking. Users browse verified opportunities, subscribe with clear terms, track performance via a secure digital portfolio, and receive automated profits and principal returns directly to their bank accounts."
  },
  {
    q: "How does Getlands verify land titles and ensure security of ownership?",
    a: "Every land parcel on Getlands undergoes rigorous legal and physical due diligence. Land is perimeter-surveyed with registered boundary beacons, vetted through relevant state ministries of land and registry archives, and confirmed free from government acquisition or traditional encumbrances. Upon purchase, investors receive an official Allocation Letter, survey plan coordinates, and a legally binding Deed of Assignment."
  },
  {
    q: "What returns can I earn from agricultural commodity trading cycles?",
    a: "Our agricultural trading cycles (covering commodities like fresh tomatoes, pepper, and garri) operate across fixed 30, 60, or 90-day intervals with defined historical returns between 5% and 20% per cycle. Trading cycles are 100% physically backed by crop aggregation and off-take agreements with commercial food processors and open markets."
  },
  {
    q: "Can Nigerians in the diaspora invest on Getlands?",
    a: "Yes. Getlands is built for both Nigerian residents and international diaspora investors across the UK, US, Canada, Europe, and worldwide. Diaspora clients can browse live opportunities, fund their accounts, track their assets digitally, inspect survey coordinates, and receive payouts directly to their local Nigerian bank accounts."
  },
  {
    q: "How do payouts and withdrawal settlements work?",
    a: "On the contractual maturity date of your opportunity or commodity cycle, your returns and principal capital are automatically credited to your secure Getlands wallet. You can request a withdrawal at any time, which is processed directly to your linked, verified Nigerian commercial bank account."
  },
  {
    q: "What is structured land banking and how does it generate returns?",
    a: "Land banking on Getlands involves acquiring strategic parcels of land in high-growth corridors (such as Abeokuta and Epe growth axes) for fixed 12 to 24-month durations. Investors benefit from projected appreciation driven by infrastructural development and expanding urban corridors, with a defined exit schedule."
  },
  {
    q: "What documents do I receive upon acquiring land on Getlands?",
    a: "Upon full payment clearance, investors receive an official Allocation Letter confirming plot boundaries, a certified Perimeter Survey Plan with registered beacon numbers, a Purchase Receipt, and an executed Deed of Assignment signed by Getlands Limited legal representatives."
  },
  {
    q: "How does the Getlands Partner and Agent Network work?",
    a: "The Getlands Partner Network enables certified real estate and financial sales agents to earn attractive commissions (up to 10% on direct purchases) by introducing clients to verified land and commodity opportunities. Agents receive real-time CRM tracking, branded marketing resources, and instant commission payouts upon transaction clearance."
  }
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section 
      id="faq" 
      aria-labelledby="faq-title"
      className="py-[100px] lg:py-[140px] px-[22px] lg:px-[max(6vw,72px)] bg-[#f7f9f7] border-t border-black/5"
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center max-w-[680px] mx-auto mb-[60px]">
          <div className="eyebrow text-[12px] tracking-[0.14em] font-extrabold text-[#008b45] uppercase mb-[14px]">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 id="faq-title" className="font-manrope text-[38px] lg:text-[54px] font-bold tracking-[-0.04em] leading-[1.08] text-[#1a1a1a] mb-[18px]">
            Everything you need to know about <span className="text-[#008b45]">Getlands</span>.
          </h2>
          <p className="text-[16px] text-[#68736d] leading-relaxed">
            Direct facts on title verification, agricultural commodity rotations, transparent return schedules, and legal backing in Nigeria.
          </p>
        </div>

        <div className="space-y-[16px]">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-[20px] border border-black/5 overflow-hidden transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-[24px_28px] flex items-center justify-between gap-[20px] font-manrope font-bold text-[17px] lg:text-[19px] text-[#1a1a1a] hover:text-[#008b45] transition-colors"
                >
                  <span>{item.q}</span>
                  <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'bg-[#008b45] text-white rotate-180' : 'bg-[#f7f9f7] text-[#68736d]'}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </button>
                {isOpen && (
                  <div className="px-[28px] pb-[28px] pt-0 text-[15px] text-[#68736d] leading-[1.7] border-t border-black/5 animate-in fade-in duration-200">
                    <p className="pt-[16px]">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-[50px] p-[28px] bg-white rounded-[20px] border border-black/5 text-center flex flex-col sm:flex-row items-center justify-between gap-[20px]">
          <div className="text-left">
            <h4 className="font-manrope font-bold text-[17px] text-[#1a1a1a]">Have more questions or need a private site inspection?</h4>
            <p className="text-[13px] text-[#68736d]">Our real-asset advisory team is on standby to assist you.</p>
          </div>
          <a 
            href="https://wa.me/2349133485636"
            target="_blank"
            rel="noopener noreferrer"
            className="px-[24px] py-[13px] bg-[#008b45] hover:bg-[#007339] text-white font-bold text-[14px] rounded-full transition-all shadow-[0_6px_20px_rgba(0,139,69,0.2)] shrink-0"
          >
            Chat on WhatsApp ↗
          </a>
        </div>
      </div>
    </section>
  );
}
