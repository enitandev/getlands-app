"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { OpportunityCategory, formatCurrency } from '@/lib/mockData';
import { MarketCard } from '@/components/ui/MarketCard';
import { FarmCard } from '@/components/ui/FarmCard';
import { LandBankingCard } from '@/components/ui/LandBankingCard';

export default function ClientExplore({ opportunities, isLoggedIn, role }: { opportunities: any[], isLoggedIn?: boolean, role?: string }) {
  const [activeCategory, setActiveCategory] = useState<OpportunityCategory | 'all'>('all');
  
  const filtered = opportunities.filter(opp => activeCategory === 'all' || opp.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#f7f9f7] pt-[90px] lg:pt-[120px] pb-[80px]">
      <header className="fixed z-50 top-[10px] lg:top-[18px] left-1/2 -translate-x-1/2 w-[calc(100%-36px)] lg:w-[min(1480px,calc(100%-72px))] h-[60px] lg:h-[68px] flex items-center justify-between">
        <Link href="/" className="brand block w-[120px] lg:w-[143px]">
          <img src="/assets/getlands-logo.png" alt="Getlands" className="w-full block" />
        </Link>
        <div className="flex items-center gap-[10px]">
          {isLoggedIn ? (
            <Link href={role === 'admin' ? '/admin' : '/dashboard'} className="px-[20px] py-[10px] bg-[#008b45] text-white rounded-full text-[13px] font-bold shadow-[0_8px_20px_rgba(0,139,69,0.25)] hover:bg-[#007339] transition-colors">
              {role === 'admin' ? 'Admin Panel' : 'Dashboard'}
            </Link>
          ) : (
            <Link href="/login" className="text-[#18201c] text-[14px] font-bold">Sign In</Link>
          )}
        </div>
      </header>

      <div className="px-[22px] lg:px-[max(6vw,72px)]">
        <h1 className="font-manrope text-[40px] lg:text-[60px] tracking-[-0.05em] mb-[30px]">
          Marketplace
        </h1>

        <div className="flex gap-[10px] overflow-x-auto pb-[20px] mb-[30px] scrollbar-hide">
          <button onClick={() => setActiveCategory('all')} className={`whitespace-nowrap px-[18px] py-[10px] rounded-full text-[12px] font-bold transition-colors ${activeCategory === 'all' ? 'bg-[#18201c] text-white' : 'bg-white border border-black/10 text-[#4a554f] hover:bg-[#eef3ef]'}`}>All Opportunities</button>
          <button onClick={() => setActiveCategory('land')} className={`whitespace-nowrap px-[18px] py-[10px] rounded-full text-[12px] font-bold transition-colors ${activeCategory === 'land' ? 'bg-[#18201c] text-white' : 'bg-white border border-black/10 text-[#4a554f] hover:bg-[#eef3ef]'}`}>Land</button>
          <button onClick={() => setActiveCategory('farm')} className={`whitespace-nowrap px-[18px] py-[10px] rounded-full text-[12px] font-bold transition-colors ${activeCategory === 'farm' ? 'bg-[#18201c] text-white' : 'bg-white border border-black/10 text-[#4a554f] hover:bg-[#eef3ef]'}`}>Farms</button>
          <button onClick={() => setActiveCategory('land_banking')} className={`whitespace-nowrap px-[18px] py-[10px] rounded-full text-[12px] font-bold transition-colors ${activeCategory === 'land_banking' ? 'bg-[#18201c] text-white' : 'bg-white border border-black/10 text-[#4a554f] hover:bg-[#eef3ef]'}`}>Land Banking</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]">

          {filtered.map(opp => {
            const cohort = opp.cohorts && opp.cohorts.length > 0 ? opp.cohorts[0] : null;
            const cohortStatus = cohort ? cohort.status : opp.status;
            let cohortProgress = 0;
            if (cohort && cohort.capacityAmount > 0) {
               cohortProgress = Math.min(100, Math.round((cohort.committedAmount / cohort.capacityAmount) * 100));
            }

            if (opp.category === 'land') {

              return (
                <Link key={opp.id} href={`/explore/${opp.slug}`} className="block relative h-[360px] hover:-translate-y-[5px] transition-transform duration-300">
                  <MarketCard
                    category="Land"
                    title={opp.title}
                    location={`${opp.location}, ${opp.state}`}
                    priceOrReturn={formatCurrency(opp.price)}
                    imageUrl={opp.coverImage}
                    status={opp.status}
                    className="w-full h-full"
                    cohortStatus={cohortStatus}
                    cohortProgress={cohortProgress}
                    cohortOpensAt={cohort?.publicOpensAt || cohort?.preorderOpensAt}
                    cohortClosesAt={cohort?.closesAt}
                  />
                </Link>
              );
            } else if (opp.category === 'farm') {
              return (
                <Link key={opp.id} href={`/explore/${opp.slug}`} className="block relative h-[360px] hover:-translate-y-[5px] transition-transform duration-300">
                  <FarmCard
                    crop={opp.title.split(' ')[0]}
                    cycle={opp.duration || 'N/A'}
                    title={opp.title}
                    location={`${opp.location}, ${opp.state}`}
                    targetReturn={opp.projectedReturn || '0%'}
                    returnsFrequency={opp.returnsFrequency}
                    price={formatCurrency(opp.slotPrice || 0)}
                    imageUrl={opp.coverImage}
                    status={opp.status}
                    className="w-full h-full"
                    cohortStatus={cohortStatus}
                    cohortProgress={cohortProgress}
                    cohortOpensAt={cohort?.publicOpensAt || cohort?.preorderOpensAt}
                    cohortClosesAt={cohort?.closesAt}
                  />
                </Link>
              );
            } else {
              return (
                <Link key={opp.id} href={`/explore/${opp.slug}`} className="block relative h-[360px] hover:-translate-y-[5px] transition-transform duration-300">
                  <LandBankingCard
                    title={opp.title}
                    location={`${opp.location}, ${opp.state}`}
                    duration={opp.duration || 'N/A'}
                    entryPrice={formatCurrency(opp.acquisitionPrice || 0)}
                    exitPrice={formatCurrency(opp.statedExitValue || 0)}
                    imageUrl={opp.coverImage}
                    status={opp.status}
                    className="w-full h-full"
                    cohortStatus={cohortStatus}
                    cohortProgress={cohortProgress}
                    cohortOpensAt={cohort?.publicOpensAt || cohort?.preorderOpensAt}
                    cohortClosesAt={cohort?.closesAt}
                  />
                </Link>
              );
            }
          })}
        </div>
      </div>
    </main>
  );
}
