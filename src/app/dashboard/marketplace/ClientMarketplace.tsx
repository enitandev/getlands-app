"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { formatCurrency } from '@/lib/mockData';

export default function ClientMarketplace({ user, opportunities = [], returnPlans = [] }: any) {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'farm' | 'land' | 'land_banking'>('all');
  
  const featuredOpps = opportunities.filter((o: any) => o.featured);
  const filteredOpps = opportunities.filter((o: any) => {
    if (filter === 'all') return !o.featured;
    return o.category === filter && !o.featured;
  });

  const [selectedOpp, setSelectedOpp] = useState<any>(null);
  
  const getMinAmount = (opp: any) => {
    if (!opp) return 50000;
    return opp.slotPrice || opp.price || opp.acquisitionPrice || 50000;
  };

  const currentMinAmount = getMinAmount(selectedOpp);
  const amounts = [1, 2, 5, 10].map(multiplier => currentMinAmount * multiplier);
  
  const [selectedAmount, setSelectedAmount] = useState(currentMinAmount);
  const [selectedPlanId, setSelectedPlanId] = useState(returnPlans[0]?.id || "");

  const handleAcquire = (opp: any) => {
    let url = `/checkout?opp=${opp.slug}&qty=1`; // It defaults to min amount
    if (opp.category === 'farm' && returnPlans.length > 0) {
      url += `&plan=${returnPlans[1]?.id || returnPlans[0]?.id}`;
    }
    router.push(url);
  };

  const getProjectedMonthly = (amount: number, opp: any) => {
    if (opp?.category === 'farm' && returnPlans.length > 0) {
      const plan = returnPlans.find((p: any) => p.id === selectedPlanId) || returnPlans[0];
      return amount * (plan.ratePercent / 100);
    }
    
    if (!opp) return null;
    const str = opp.projectedReturn || "";
    const match = str.match(/(\d+(\.\d+)?)/);
    if (match) return amount * (parseFloat(match[1]) / 100);
    return null;
  };
  
  const getFundedPercentage = (c: any) => {
    if (!c || !c.capacityAmount) return 0;
    return Math.min(100, Math.floor((c.committedAmount / c.capacityAmount) * 100));
  };

  const renderCard = (opp: any) => {
    const oppCohort = opp.cohorts?.[0];
    const isFarm = opp.category === 'farm';
    const isLand = opp.category === 'land';
    
    return (
      <div key={opp.id} className="w-full bg-[#182a20] border border-white/5 rounded-[20px] p-[20px] shadow-sm flex flex-col justify-between relative overflow-hidden group min-h-[220px]">
        <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-[#008b45] rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="z-10 relative mb-[20px]">
          <div className="text-[10px] text-[#a6baa9] font-bold uppercase tracking-wider mb-[15px]">{opp.category.replace('_', ' ')} · {opp.location.toUpperCase()}</div>
          <h3 className="font-manrope font-bold text-[20px] text-white mb-[10px] leading-tight">{opp.title}</h3>
          
          {isFarm ? (
            <div className="font-bold text-[24px] text-[#a9e7bd] leading-none mb-[15px]">
              {returnPlans.length > 0 ? `Up to ${Math.max(...returnPlans.map((p: any) => p.ratePercent))}%` : (opp.projectedReturn || 'Variable')}
              <span className="text-[13px] text-[#a6baa9] font-normal ml-[5px]">{returnPlans.length > 0 ? 'Flexible Returns' : (opp.projectedReturn ? '/ month' : '')}</span>
            </div>
          ) : (
            <div className="font-bold text-[24px] text-[#a9e7bd] leading-none mb-[15px]">{formatCurrency(opp.price || opp.pricePerUnit || opp.acquisitionPrice || 0)}</div>
          )}
          
          {oppCohort?.closesAt ? (
            <div className="text-[12px] text-[#a6baa9] flex items-center gap-[5px]">
              Closes <div className="text-white font-mono"><CountdownTimer targetDate={oppCohort.closesAt} label="" /></div>
            </div>
          ) : (
            <div className="text-[12px] text-[#a6baa9]">{oppCohort?.status || 'OPEN'}</div>
          )}
        </div>
        <button onClick={() => handleAcquire(opp)} className="z-10 relative w-full h-[40px] mt-auto bg-[#a9e7bd] text-[#182a20] text-[13px] font-bold rounded-full hover:bg-[#86e2a6] transition-colors">
          {isFarm ? 'Acquire' : (isLand ? 'Buy land' : 'Subscribe')}
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-165px)] lg:h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide pb-[20px] lg:pb-[50px] relative">
      
      <header className="mb-[30px] shrink-0">
        <h1 className="font-manrope text-[32px] font-bold text-ink leading-tight">Marketplace</h1>
        <p className="text-[14px] text-[#68736d]">Explore all {opportunities.length} open opportunities.</p>
      </header>

      {/* Featured Section */}
      {featuredOpps.length > 0 && (
        <div className="mb-[40px] shrink-0">
          <h2 className="font-manrope text-[20px] lg:text-[24px] tracking-[-0.03em] font-bold text-ink mb-[20px]">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[20px]">
            {featuredOpps.map(renderCard)}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-[10px] overflow-x-auto scrollbar-hide mb-[30px] pb-[5px] shrink-0">
        {['all', 'farm', 'land', 'land_banking'].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-[16px] py-[8px] rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${filter === cat ? 'bg-[#182a20] text-white' : 'bg-white border border-black/5 text-ink hover:border-[#008b45]'}`}
          >
            {cat === 'all' ? 'All Opportunities' : cat === 'farm' ? 'Farms' : cat === 'land' ? 'Land' : 'Land Banking'}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredOpps.length === 0 ? (
        <div className="bg-white border border-black/5 rounded-[20px] p-[40px] text-center">
          <div className="text-[14px] font-bold text-ink mb-[5px]">No opportunities found</div>
          <p className="text-[13px] text-[#68736d]">Try changing your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[20px]">
          {filteredOpps.map(renderCard)}
        </div>
      )}

    </div>
  );
}
