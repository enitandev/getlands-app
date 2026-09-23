"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { formatCurrency } from '@/lib/mockData';

export default function ClientMarketplace({ user, opportunities = [] }: any) {
  const [filter, setFilter] = useState<'all' | 'farm' | 'land' | 'land_banking'>('all');
  
  const featuredOpps = opportunities.filter((o: any) => o.featured);
  const filteredOpps = opportunities.filter((o: any) => {
    if (filter === 'all') return !o.featured;
    return o.category === filter && !o.featured;
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'wallet'>('transfer');
  
  const getMinAmount = (opp: any) => {
    if (!opp) return 50000;
    return opp.slotPrice || opp.price || opp.acquisitionPrice || 50000;
  };

  const currentMinAmount = getMinAmount(selectedOpp);
  const amounts = [1, 2, 5, 10].map(multiplier => currentMinAmount * multiplier);
  
  const [selectedAmount, setSelectedAmount] = useState(currentMinAmount);
  const canUseWallet = user.walletBalance >= selectedAmount;

  const handleAcquire = (opp: any) => {
    setSelectedOpp(opp);
    setSelectedAmount(getMinAmount(opp));
    setIsDrawerOpen(true);
  };

  const parsePercent = (opp: any) => {
    if (!opp) return null;
    const str = opp.projectedReturn || "";
    const match = str.match(/(\d+(\.\d+)?)/);
    if (match) return parseFloat(match[1]);
    return null;
  };

  const getProjectedMonthly = (amount: number, opp: any) => {
    const percent = parsePercent(opp);
    if (percent === null) return null;
    return (amount * (percent / 100));
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
            <div className="font-bold text-[24px] text-[#a9e7bd] leading-none mb-[15px]">{opp.projectedReturn || 'Variable'} <span className="text-[13px] text-[#a6baa9] font-normal">{opp.projectedReturn ? '/ month' : ''}</span></div>
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

      {/* Drawer Overlay */}
      {isDrawerOpen && selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center p-[15px] sm:p-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="bg-[#f7f9f7] w-full max-w-[500px] rounded-t-[30px] lg:rounded-[30px] relative z-10 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full lg:slide-in-from-bottom-10 fade-in duration-300">
            <div className="p-[20px] lg:p-[30px]">
              <div className="w-[40px] h-[4px] bg-black/10 rounded-full mx-auto mb-[20px] lg:hidden"></div>
              
              <div className="flex justify-between items-start mb-[20px]">
                <h2 className="font-manrope text-[28px] font-bold text-ink leading-tight">Confirm<br/>investment</h2>
                <button onClick={() => setIsDrawerOpen(false)} className="w-[36px] h-[36px] bg-white rounded-full border border-black/5 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <div className="bg-white rounded-[16px] p-[20px] border border-black/5 mb-[20px] space-y-[15px] text-[14px]">
                <div className="flex justify-between">
                  <span className="text-[#68736d]">Opportunity</span>
                  <strong className="text-ink">{selectedOpp.title}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68736d]">You invest</span>
                  <strong className="text-ink">{formatCurrency(selectedAmount)}</strong>
                </div>
                {getProjectedMonthly(selectedAmount, selectedOpp) !== null && (
                  <div className="flex justify-between">
                    <span className="text-[#68736d]">Projected monthly</span>
                    <strong className="text-[#008b45]">≈ {formatCurrency(getProjectedMonthly(selectedAmount, selectedOpp)!)}</strong>
                  </div>
                )}
                {selectedOpp.duration && (
                  <div className="flex justify-between">
                    <span className="text-[#68736d]">Tenor</span>
                    <strong className="text-ink">[{selectedOpp.duration} months]</strong>
                  </div>
                )}
              </div>

              <div className="mb-[15px] text-[13px] font-bold text-[#68736d]">Choose amount</div>
              <div className="grid grid-cols-2 gap-[10px] mb-[20px]">
                {amounts.map((amt) => (
                  <button 
                    key={amt}
                    onClick={() => setSelectedAmount(amt)}
                    className={`h-[45px] rounded-[10px] font-bold text-[14px] transition-all ${selectedAmount === amt ? 'bg-[#182a20] text-white' : 'bg-white border border-black/10 hover:border-[#008b45] text-ink'}`}
                  >
                    {formatCurrency(amt).replace('.00', '').replace('NGN', '₦')}
                  </button>
                ))}
              </div>

              <div className="mb-[15px] text-[13px] font-bold text-[#68736d]">Pay with</div>
              <div className="space-y-[10px] mb-[20px]">
                <label className={`flex items-start p-[15px] rounded-[16px] border-[2px] cursor-pointer transition-colors ${paymentMethod === 'transfer' ? 'border-[#008b45] bg-[#eef3ef]/50' : 'border-white bg-white hover:border-black/5 shadow-sm'}`}>
                  <div className={`mt-[2px] w-[20px] h-[20px] rounded-full border-[2px] flex items-center justify-center shrink-0 mr-[15px] ${paymentMethod === 'transfer' ? 'border-[#008b45]' : 'border-gray-300'}`}>
                    {paymentMethod === 'transfer' && <div className="w-[10px] h-[10px] bg-[#008b45] rounded-full"></div>}
                  </div>
                  <input type="radio" className="hidden" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} />
                  <div>
                    <div className="font-bold text-[15px] text-ink mb-[2px]">Bank transfer</div>
                    <div className="text-[13px] text-[#68736d]">Pay from any Nigerian bank via Moniepoint</div>
                  </div>
                </label>

                <label className={`flex items-start p-[15px] rounded-[16px] border-[2px] transition-colors ${!canUseWallet ? 'opacity-50 cursor-not-allowed bg-transparent border-black/5 border-dashed' : paymentMethod === 'wallet' ? 'border-[#008b45] bg-[#eef3ef]/50 cursor-pointer' : 'border-white bg-white hover:border-black/5 shadow-sm cursor-pointer'}`}>
                  <div className={`mt-[2px] w-[20px] h-[20px] rounded-full border-[2px] flex items-center justify-center shrink-0 mr-[15px] ${paymentMethod === 'wallet' ? 'border-[#008b45]' : 'border-gray-300'}`}>
                    {paymentMethod === 'wallet' && <div className="w-[10px] h-[10px] bg-[#008b45] rounded-full"></div>}
                  </div>
                  <input type="radio" className="hidden" disabled={!canUseWallet} checked={paymentMethod === 'wallet'} onChange={() => { if(canUseWallet) setPaymentMethod('wallet'); }} />
                  <div className="flex-1">
                    <div className="font-bold text-[15px] text-ink mb-[2px]">Wallet · {formatCurrency(user.walletBalance)} available</div>
                    {!canUseWallet && <div className="text-[13px] text-[#e53935] font-bold text-right absolute right-[15px] top-[18px]">Not enough</div>}
                  </div>
                </label>
              </div>

              <form action="/dashboard/checkout" method="POST">
                <input type="hidden" name="opportunityId" value={selectedOpp.id} />
                <input type="hidden" name="amount" value={selectedAmount} />
                <input type="hidden" name="paymentMethod" value={paymentMethod} />
                
                <button type="submit" className="w-full h-[55px] bg-[#182a20] hover:bg-black text-white font-bold text-[16px] rounded-[12px] flex items-center justify-center gap-[10px] transition-colors shadow-[0_10px_20px_rgba(24,42,32,0.15)]">
                  Pay {formatCurrency(selectedAmount).replace('.00', '').replace('NGN', '₦')}
                </button>
              </form>
              
              <div className="text-center mt-[15px] text-[11px] text-[#7a847f]">
                Returns are projected, not guaranteed. Capital is at risk.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
