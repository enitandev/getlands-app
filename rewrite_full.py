with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write('''"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { formatCurrency } from '@/lib/mockData';

export default function ClientDashboardOverview({ user, opportunities = [] }: any) {
  const openOpps = opportunities?.filter((o: any) => o.status === 'available') || [];
  
  const featuredOpps = openOpps.filter((o: any) => o.featured);
  const carouselOpps = featuredOpps.length > 0 ? featuredOpps : openOpps;
  
  const [featuredIndex, setFeaturedIndex] = useState(0);
  
  const handleFeaturedPrev = () => setFeaturedIndex(prev => (prev === 0 ? carouselOpps.length - 1 : prev - 1));
  const handleFeaturedNext = () => setFeaturedIndex(prev => (prev === carouselOpps.length - 1 ? 0 : prev + 1));
  
  const currentOpp = carouselOpps[featuredIndex] || openOpps[0];
  const cohort = currentOpp?.cohorts?.[0];
  
  const getMinAmount = (opp: any) => {
    if (!opp) return 50000;
    return opp.slotPrice || opp.price || opp.acquisitionPrice || 50000;
  };
  
  const minAmount = getMinAmount(currentOpp);
  const amounts = [1, 2, 5, 10].map(multiplier => minAmount * multiplier);
  
  const [selectedAmount, setSelectedAmount] = useState(amounts[1] || amounts[0] || 100000);
  
  useEffect(() => {
    setSelectedAmount(amounts[1] || amounts[0] || 100000);
  }, [featuredIndex]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'wallet'>('transfer');

  const totalValue = user.holdings?.reduce((sum: number, h: any) => sum + (h.totalAmount || 0), 0) || 0;
  const activeHoldingsCount = user.holdings?.filter((h: any) => h.status === 'active').length || 0;
  
  const farmCount = user.holdings?.filter((h: any) => h.opportunity?.category === 'farm').length || 0;
  const landCount = user.holdings?.filter((h: any) => h.opportunity?.category === 'land').length || 0;
  const landBankingCount = user.holdings?.filter((h: any) => h.opportunity?.category === 'land_banking').length || 0;

  const canUseWallet = user.walletBalance >= selectedAmount;

  const parsePercent = (opp: any) => {
    if (!opp) return null;
    const str = opp.projectedReturn || "";
    const match = str.match(/(\\d+(\\.\\d+)?)/);
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
  
  const getNextPayout = () => {
    if (!user.holdings || user.holdings.length === 0) return null;
    const upcoming = user.holdings
      .filter((h: any) => h.cohort && h.cohort.maturityAt && new Date(h.cohort.maturityAt) > new Date())
      .sort((a: any, b: any) => new Date(a.cohort.maturityAt).getTime() - new Date(b.cohort.maturityAt).getTime());
    
    if (upcoming.length > 0) {
      return upcoming[0];
    }
    return null;
  };
  const nextPayout = getNextPayout();

  // Also Open Logic
  const alsoOpenOpps = openOpps.filter((o: any) => o.id !== currentOpp?.id);
  const [alsoOpenIndex, setAlsoOpenIndex] = useState(0);

  return (
    <div className="flex flex-col h-[calc(100dvh-165px)] lg:h-auto overflow-y-auto lg:overflow-visible scrollbar-hide pb-[5px] lg:pb-0 relative">
      
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between mb-[10px]">
        <div>
          <h1 className="text-[13px] text-[#68736d]">Good evening</h1>
          <h2 className="font-manrope text-[20px] font-bold text-ink leading-tight">{user.firstName}</h2>
        </div>
        <div className="flex items-center gap-[15px]">
          <div className="flex items-center gap-[6px] bg-[#f7f9f7] px-[10px] py-[4px] rounded-full border border-black/5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#008b45" strokeWidth="2"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
            <span className="text-[11px] font-bold text-ink">Earn 10%</span>
          </div>
          <Link href="/dashboard/settings" className="relative w-[32px] h-[32px] bg-[#eef3ef] text-[#008b45] font-bold rounded-full flex items-center justify-center border border-black/5 shadow-sm text-[12px] tracking-wider uppercase">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </Link>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex items-center justify-between mb-[30px]">
        <div>
          <h1 className="font-manrope text-[32px] font-bold text-ink leading-tight">Good evening, {user.firstName}</h1>
          <p className="text-[14px] text-[#68736d]">{openOpps.length} opportunities are open. {currentOpp?.title ? `${carouselOpps.length} available in featured.` : ''}</p>
        </div>
        <div className="flex items-center gap-[15px]">
          <Link href="/dashboard/wallet" className="flex items-center gap-[6px] bg-white px-[16px] py-[10px] rounded-full border border-black/5 shadow-sm font-bold text-[13px] hover:text-[#008b45] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Fund wallet
          </Link>
          <button className="relative w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center border border-black/5 shadow-sm text-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            {user.notifications?.length > 0 && <span className="absolute top-[10px] right-[12px] w-2 h-2 bg-[#e53935] rounded-full"></span>}
          </button>
        </div>
      </header>

      {/* Mobile Portfolio & Wallet Bar */}
      <div className="lg:hidden flex bg-white border border-black/5 rounded-[16px] p-[12px] mb-[10px] shadow-sm shrink-0">
        <div className="flex-1 border-r border-black/5 pr-[15px]">
          <div className="text-[11px] text-[#68736d] font-bold mb-[2px]">Portfolio</div>
          <div className="font-manrope font-bold text-[18px] tracking-tight">{formatCurrency(totalValue)}</div>
        </div>
        <div className="flex-1 pl-[15px] flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#68736d] font-bold mb-[2px]">Wallet</div>
            <div className="font-manrope font-bold text-[18px] tracking-tight">{formatCurrency(user.walletBalance)}</div>
          </div>
          <Link href="/dashboard/wallet" className="bg-[#eef3ef] text-[#008b45] px-[10px] py-[4px] rounded-full text-[10px] font-bold">
            Fund
          </Link>
        </div>
      </div>

      <div className="lg:hidden flex items-center justify-between mb-[8px] shrink-0">
        <div className="flex items-center gap-[5px] text-[10px] font-bold uppercase tracking-wider text-[#008b45]">
          <span className="w-[6px] h-[6px] bg-[#008b45] rounded-full animate-pulse"></span>
          FEATURED NOW <span className="text-[#68736d] ml-[5px] font-normal">{carouselOpps.length > 0 ? featuredIndex + 1 : 0} OF {carouselOpps.length}</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px] lg:gap-[30px] mb-[20px] lg:mb-[40px] shrink-0">
        
        {/* Featured Opportunity Block */}
        {currentOpp && (
          <div className="lg:col-span-8 bg-[#182a20] rounded-[20px] lg:rounded-[24px] p-[15px] lg:p-[30px] text-white flex flex-col lg:flex-row gap-[20px] lg:gap-[30px] relative overflow-hidden shadow-lg border border-black/5">
            <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-[#008b45] rounded-full blur-[80px] opacity-10 pointer-events-none -translate-y-1/2 -translate-x-1/3"></div>

            <div className="flex-1 z-10 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-[10px] lg:mb-[20px]">
                  <div className="bg-white/10 px-[10px] py-[4px] rounded-full text-[10px] font-bold uppercase tracking-wider text-[#a6baa9]">
                    FEATURED · {currentOpp.category.toUpperCase()} · {currentOpp.location.toUpperCase()}
                  </div>
                  <div className="flex gap-[10px]">
                    <button onClick={handleFeaturedPrev} className="w-[30px] h-[30px] rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
                    <button onClick={handleFeaturedNext} className="w-[30px] h-[30px] rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
                  </div>
                </div>
                
                <h3 className="font-manrope text-[24px] lg:text-[48px] font-bold leading-none mb-[5px] tracking-tight">{currentOpp.title}</h3>
                
                <div className="flex items-end gap-[8px] mb-[15px] lg:mb-[30px]">
                  <div className="font-manrope text-[36px] lg:text-[64px] font-bold text-[#a9e7bd] leading-none tracking-tighter">{currentOpp.projectedReturn || 'Variable'}</div>
                  {currentOpp.projectedReturn && <div className="text-[13px] text-[#a6baa9] pb-[8px] leading-tight">projected /<br/>month</div>}
                </div>
              </div>

              <div className="flex flex-row gap-[10px] lg:gap-[15px] mb-[15px] lg:mb-[30px]">
                {cohort?.closesAt ? (
                  <div className="bg-white/5 border border-white/10 rounded-[10px] lg:rounded-[12px] p-[10px] lg:p-[15px] flex-1">
                    <div className="text-[10px] text-[#a6baa9] font-bold uppercase tracking-wider mb-[5px]">CLOSES IN</div>
                    <div className="font-mono text-[14px] lg:text-[18px] font-bold text-white">
                      <CountdownTimer targetDate={cohort.closesAt} label="" />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-[10px] lg:rounded-[12px] p-[10px] lg:p-[15px] flex-1">
                    <div className="text-[10px] text-[#a6baa9] font-bold uppercase tracking-wider mb-[5px]">STATUS</div>
                    <div className="font-mono text-[14px] lg:text-[18px] font-bold text-white uppercase">{cohort?.status || 'OPEN NOW'}</div>
                  </div>
                )}
                <div className="bg-white/5 border border-white/10 rounded-[10px] lg:rounded-[12px] p-[10px] lg:p-[15px] flex-1">
                  <div className="text-[10px] text-[#a6baa9] font-bold uppercase tracking-wider mb-[5px]">[{getFundedPercentage(cohort)}]% FUNDED</div>
                  <div className="w-full h-[6px] bg-white/10 rounded-full overflow-hidden mt-[10px]">
                    <div className={`h-full bg-[#a9e7bd] rounded-full`} style={{ width: `${getFundedPercentage(cohort)}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-[15px] text-[13px] text-[#a6baa9]">
                <span>Min [{formatCurrency(minAmount)}]</span>
                {currentOpp.duration && (
                  <>
                    <span>·</span>
                    <span>Tenor [{currentOpp.duration} months]</span>
                  </>
                )}
                <span>·</span>
                <Link href={`/explore/${currentOpp.slug}`} className="underline hover:text-white">Terms & risks</Link>
              </div>
            </div>

            <div className="lg:w-[320px] shrink-0 bg-white rounded-[16px] lg:rounded-[20px] p-[15px] lg:p-[25px] text-ink z-10">
              <div className="flex justify-between items-center mb-[10px] lg:mb-[15px]">
                <div className="lg:hidden text-[13px] text-[#68736d]">Choose amount</div>
                <div className="hidden lg:block text-[14px] font-bold">How much?</div>
                <div className="lg:hidden text-[11px] text-[#68736d]">Min [{formatCurrency(minAmount)}] {currentOpp.duration ? `· [${currentOpp.duration}] months` : ''}</div>
              </div>

              <div className="grid grid-cols-2 gap-[8px] lg:gap-[10px] mb-[15px] lg:mb-[20px]">
                {amounts.map((amt) => (
                  <button 
                    key={amt}
                    onClick={() => setSelectedAmount(amt)}
                    className={`h-[36px] lg:h-[45px] rounded-[10px] font-bold text-[14px] transition-all ${selectedAmount === amt ? 'bg-[#182a20] text-white' : 'border border-black/10 hover:border-[#008b45] text-ink'}`}
                  >
                    {formatCurrency(amt).replace('.00', '').replace('NGN', '₦')}
                  </button>
                ))}
              </div>

              <div className="hidden lg:block space-y-[10px] mb-[20px] text-[13px] border-t border-black/5 pt-[15px]">
                <div className="flex justify-between text-[#68736d]">
                  <span>You invest</span>
                  <strong className="text-ink">{formatCurrency(selectedAmount)}</strong>
                </div>
                {getProjectedMonthly(selectedAmount, currentOpp) !== null && (
                  <div className="flex justify-between text-[#68736d]">
                    <span>Projected monthly</span>
                    <strong className="text-[#008b45]">≈ {formatCurrency(getProjectedMonthly(selectedAmount, currentOpp)!)}</strong>
                  </div>
                )}
                <div className="flex justify-between text-[#68736d]">
                  <span>Pay with</span>
                  <strong className="text-ink">Transfer or card</strong>
                </div>
              </div>

              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="w-full h-[45px] lg:h-[55px] bg-[#a9e7bd] hover:bg-[#86e2a6] text-[#182a20] font-bold text-[16px] rounded-[12px] flex items-center justify-center gap-[10px] transition-colors"
              >
                Acquire {formatCurrency(selectedAmount).replace('.00', '').replace('NGN', '₦')}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>

              <div className="lg:hidden flex justify-between items-center mt-[10px] text-[11px]">
                {getProjectedMonthly(selectedAmount, currentOpp) !== null ? (
                  <span className="text-[#68736d]">≈ {formatCurrency(getProjectedMonthly(selectedAmount, currentOpp)!)}/mo projected</span>
                ) : (
                  <span className="text-[#68736d]">Returns vary per cycle</span>
                )}
                <Link href={`/explore/${currentOpp.slug}`} className="text-[#008b45] underline font-bold">Terms & risks</Link>
              </div>
              <div className="hidden lg:block text-center mt-[10px] text-[10px] text-[#7a847f]">
                Projected, not guaranteed. Capital at risk.
              </div>
            </div>
          </div>
        )}

        {/* Desktop Portfolio Card */}
        <div className="hidden lg:flex lg:col-span-4 bg-white rounded-[24px] border border-black/5 shadow-sm p-[30px] flex-col relative overflow-hidden">
          <div className="text-[11px] font-bold text-[#68736d] uppercase tracking-wider mb-[10px]">YOUR PORTFOLIO</div>
          <div className="font-manrope font-bold text-[48px] tracking-tight text-ink leading-none mb-[20px]">
            {formatCurrency(totalValue)}
          </div>
          <div className="flex flex-wrap gap-[10px] mb-[30px]">
            <div className="bg-[#f7f9f7] px-[12px] py-[6px] rounded-full text-[12px] font-bold text-ink border border-black/5">{farmCount} Farm cycle</div>
            <div className="bg-[#f7f9f7] px-[12px] py-[6px] rounded-full text-[12px] font-bold text-ink border border-black/5">{landCount} Land</div>
            <div className="bg-[#f7f9f7] px-[12px] py-[6px] rounded-full text-[12px] font-bold text-ink border border-black/5">{landBankingCount} Land banking</div>
          </div>

          {nextPayout ? (
            <div className="bg-[#f7f9f7] rounded-[16px] p-[20px] mb-[40px]">
              <div className="text-[12px] text-[#68736d] font-bold mb-[5px]">Next payout</div>
              <div className="font-bold text-ink text-[16px]">[{new Date(nextPayout.cohort.maturityAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}] · {nextPayout.opportunity?.title}</div>
            </div>
          ) : (
            <div className="bg-[#f7f9f7] rounded-[16px] p-[20px] mb-[40px]">
              <div className="text-[12px] text-[#68736d] font-bold mb-[5px]">Next payout</div>
              <div className="font-bold text-ink text-[14px]">No upcoming payouts scheduled</div>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-[20px]">
            <div>
              <div className="text-[12px] text-[#68736d] font-bold mb-[2px]">Wallet balance</div>
              <div className="font-manrope font-bold text-[20px]">{formatCurrency(user.walletBalance)}</div>
            </div>
            <Link href="/dashboard/wallet" className="bg-[#eef3ef] text-[#008b45] px-[20px] py-[10px] rounded-full text-[13px] font-bold hover:bg-[#008b45] hover:text-white transition-colors">
              Fund
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Lists Area (Desktop & Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px] lg:gap-[30px] shrink-0">
        
        {/* Also open Carousel */}
        <div className="lg:col-span-8 min-w-0 bg-white rounded-[24px] border border-black/5 p-[20px] lg:p-[30px] shadow-sm mb-[20px] lg:mb-[40px]">
          <div className="flex items-center justify-between mb-[20px]">
            <h2 className="font-manrope text-[20px] lg:text-[24px] tracking-[-0.03em] font-bold text-ink">Also open</h2>
            
            <div className="flex gap-[10px]">
              <button 
                onClick={() => setAlsoOpenIndex(prev => Math.max(0, prev - 1))}
                disabled={alsoOpenIndex === 0}
                className="w-[36px] h-[36px] rounded-full border border-black/10 flex items-center justify-center text-ink hover:bg-black/5 disabled:opacity-30 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <button 
                onClick={() => setAlsoOpenIndex(prev => Math.min(alsoOpenOpps.length - 1, prev + 1))}
                disabled={alsoOpenIndex >= alsoOpenOpps.length - 1}
                className="w-[36px] h-[36px] rounded-full border border-black/10 flex items-center justify-center text-ink hover:bg-black/5 disabled:opacity-30 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>
          
          {alsoOpenOpps.length === 0 ? (
            <div className="text-center py-[40px] text-[#68736d] text-[14px]">
              No other opportunities currently available.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
              {alsoOpenOpps.slice(alsoOpenIndex, alsoOpenIndex + 2).map((opp: any, idx: number) => {
                const owned = user.holdings?.find((h:any) => h.opportunityId === opp.id);
                const oppCohort = opp.cohorts?.[0];
                return (
                  <div key={opp.id} className={`w-full bg-[#182a20] border border-white/5 rounded-[20px] p-[20px] shadow-sm flex-col justify-between relative overflow-hidden group ${idx === 1 ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-[#008b45] rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                    <div className="z-10 relative mb-[20px]">
                      <div className="flex justify-between items-start mb-[15px]">
                        <div className="text-[10px] text-[#a6baa9] font-bold uppercase tracking-wider">{opp.category.replace('_', ' ')} · {opp.location.toUpperCase()}</div>
                        {owned && (
                          <div className="bg-white/10 text-[#a9e7bd] text-[10px] font-bold px-[8px] py-[4px] rounded-[6px] text-center leading-tight">
                            You own<br/>{formatCurrency(owned.totalAmount).replace('.00', '')}
                          </div>
                        )}
                      </div>
                      <h3 className="font-manrope font-bold text-[20px] text-white mb-[10px] leading-tight">{opp.title}</h3>
                      
                      {opp.category === 'farm' ? (
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
                    <button className="z-10 relative w-full h-[40px] mt-auto bg-[#a9e7bd] text-[#182a20] text-[13px] font-bold rounded-full hover:bg-[#86e2a6] transition-colors">
                      {owned ? 'Add to position' : (opp.category === 'farm' ? 'Acquire' : (opp.category === 'land' ? 'Buy land' : 'Subscribe'))}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 min-w-0 mb-[40px] lg:mb-0">
          <div className="flex items-center justify-between mb-[20px]">
            <h2 className="font-manrope text-[20px] lg:text-[24px] tracking-[-0.03em] font-bold text-ink">Holdings</h2>
            <Link href="/dashboard/holdings" className="text-[14px] font-bold text-[#008b45] hover:underline">View all</Link>
          </div>
          <div className="bg-white border border-black/5 rounded-[20px] p-[20px] shadow-sm">
            {user.holdings?.length === 0 ? (
              <div className="text-center py-[20px]">
                <div className="text-[14px] font-bold text-ink mb-[5px]">Nothing needs your attention</div>
                <p className="text-[13px] text-[#68736d]">Payouts, renewals and documents will show up here.</p>
              </div>
            ) : (
              <div className="space-y-[15px]">
                {user.holdings?.slice(0,3).map((h:any) => (
                  <div key={h.id} className="flex justify-between items-start border-b border-black/5 pb-[15px] last:border-0 last:pb-0">
                    <div className="flex gap-[15px]">
                      <div className="w-[36px] h-[36px] rounded-[10px] bg-[#eef3ef] text-[#008b45] flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      </div>
                      <div>
                        <div className="font-bold text-[14px] text-ink">{h.opportunity?.title}</div>
                        <div className="text-[12px] text-[#68736d]">{h.opportunity?.location} · {h.status === 'active' ? 'Active' : 'Matured'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[14px] text-ink mb-[2px]">{formatCurrency(h.totalAmount)}</div>
                      <Link href={`/api/documents/receipt/${h.id}`} target="_blank" className="text-[11px] font-bold text-[#008b45] hover:underline">Receipt</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
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
                  <strong className="text-ink">{currentOpp?.title}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68736d]">You invest</span>
                  <strong className="text-ink">{formatCurrency(selectedAmount)}</strong>
                </div>
                {getProjectedMonthly(selectedAmount, currentOpp) !== null && (
                  <div className="flex justify-between">
                    <span className="text-[#68736d]">Projected monthly</span>
                    <strong className="text-[#008b45]">≈ {formatCurrency(getProjectedMonthly(selectedAmount, currentOpp)!)}</strong>
                  </div>
                )}
                {currentOpp?.duration && (
                  <div className="flex justify-between">
                    <span className="text-[#68736d]">Tenor</span>
                    <strong className="text-ink">[{currentOpp.duration} months]</strong>
                  </div>
                )}
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
                <input type="hidden" name="opportunityId" value={currentOpp?.id} />
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
''')
