"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { formatCurrency } from '@/lib/mockData';

export default function ClientDashboardOverview({ user, opportunities = [] }: any) {
  // Find a featured opportunity (ideally Farm or whatever is closing first)
  const featuredOpp = opportunities.find((o: any) => o.status === 'OPEN' && o.category === 'farm') || opportunities[0];
  const cohort = featuredOpp?.cohorts?.[0];
  
  const minAmount = featuredOpp?.pricePerUnit || 50000;
  const amounts = [1, 2, 5, 10].map(multiplier => minAmount * multiplier);
  
  const [selectedAmount, setSelectedAmount] = useState(amounts[1] || amounts[0] || 100000);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'wallet'>('transfer');

  const totalValue = user.holdings?.reduce((sum: number, h: any) => sum + (h.totalAmount || 0), 0) || 0;
  const activeHoldingsCount = user.holdings?.filter((h: any) => h.status === 'active').length || 0;
  
  const farmCount = user.holdings?.filter((h: any) => h.opportunity?.category === 'farm').length || 0;
  const landCount = user.holdings?.filter((h: any) => h.opportunity?.category === 'land').length || 0;
  const landBankingCount = user.holdings?.filter((h: any) => h.opportunity?.category === 'land_banking').length || 0;

  const canUseWallet = user.walletBalance >= selectedAmount;

  // Separate opportunities for bottom row
  const openFarms = opportunities.filter((o: any) => o.category === 'farm' && o.status === 'OPEN' && o.id !== featuredOpp?.id);
  const openLands = opportunities.filter((o: any) => o.category === 'land' && o.status === 'OPEN');
  const openLandBanking = opportunities.filter((o: any) => o.category === 'land_banking' && o.status === 'OPEN');

  const getProjectedMonthly = (amount: number, opp: any) => {
    // Mock logic for projection display
    const percent = parseFloat(opp?.projectedReturn) || 15;
    return (amount * (percent / 100));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] lg:h-auto overflow-y-auto lg:overflow-visible scrollbar-hide pb-[20px] lg:pb-0 relative">
      
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between mb-[20px]">
        <div>
          <h1 className="text-[13px] text-[#68736d]">Good evening</h1>
          <h2 className="font-manrope text-[24px] font-bold text-ink leading-tight">{user.firstName}</h2>
        </div>
        <div className="flex items-center gap-[15px]">
          <div className="flex items-center gap-[6px] bg-[#f7f9f7] px-[12px] py-[6px] rounded-full border border-black/5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#008b45" strokeWidth="2"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
            <span className="text-[11px] font-bold text-ink">Earn 10%</span>
          </div>
          <button className="relative w-[36px] h-[36px] bg-white rounded-full flex items-center justify-center border border-black/5 shadow-sm text-ink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span className="absolute top-[8px] right-[10px] w-2 h-2 bg-[#e53935] rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex items-center justify-between mb-[30px]">
        <div>
          <h1 className="font-manrope text-[32px] font-bold text-ink leading-tight">Good evening, {user.firstName}</h1>
          <p className="text-[14px] text-[#68736d]">{opportunities.filter((o:any)=>o.status==='OPEN').length} opportunities are open. {featuredOpp?.title} closes first.</p>
        </div>
        <div className="flex items-center gap-[15px]">
          <Link href="/dashboard/wallet" className="flex items-center gap-[6px] bg-white px-[16px] py-[10px] rounded-full border border-black/5 shadow-sm font-bold text-[13px] hover:text-[#008b45] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Fund wallet
          </Link>
          <button className="relative w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center border border-black/5 shadow-sm text-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span className="absolute top-[10px] right-[12px] w-2 h-2 bg-[#e53935] rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Mobile Portfolio & Wallet Bar */}
      <div className="lg:hidden flex bg-white border border-black/5 rounded-[20px] p-[20px] mb-[20px] shadow-sm">
        <div className="flex-1 border-r border-black/5 pr-[15px]">
          <div className="text-[11px] text-[#68736d] font-bold mb-[2px]">Portfolio</div>
          <div className="font-manrope font-bold text-[22px] tracking-tight">{formatCurrency(totalValue)}</div>
        </div>
        <div className="flex-1 pl-[15px] flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#68736d] font-bold mb-[2px]">Wallet</div>
            <div className="font-manrope font-bold text-[22px] tracking-tight">{formatCurrency(user.walletBalance)}</div>
          </div>
          <Link href="/dashboard/wallet" className="bg-[#eef3ef] text-[#008b45] px-[12px] py-[6px] rounded-full text-[11px] font-bold">
            Fund
          </Link>
        </div>
      </div>

      <div className="lg:hidden flex items-center justify-between mb-[10px]">
        <div className="flex items-center gap-[5px] text-[10px] font-bold uppercase tracking-wider text-[#008b45]">
          <span className="w-[6px] h-[6px] bg-[#008b45] rounded-full animate-pulse"></span>
          OPEN NOW <span className="text-[#68736d] ml-[5px] font-normal">1 of {opportunities.filter((o:any)=>o.status==='OPEN').length}</span>
        </div>
        <Link href="/explore" className="text-[#008b45] text-[12px] font-bold hover:underline">See all</Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px] lg:gap-[30px] mb-[30px] lg:mb-[40px]">
        
        {/* Featured Opportunity Block */}
        {featuredOpp && (
          <div className="lg:col-span-8 bg-[#182a20] rounded-[24px] p-[20px] lg:p-[30px] text-white flex flex-col lg:flex-row gap-[20px] lg:gap-[30px] relative overflow-hidden shadow-lg border border-black/5">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-[#008b45] rounded-full blur-[80px] opacity-10 pointer-events-none -translate-y-1/2 -translate-x-1/3"></div>

            {/* Left Info Side */}
            <div className="flex-1 z-10 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-[20px]">
                  <div className="bg-white/10 px-[10px] py-[4px] rounded-full text-[10px] font-bold uppercase tracking-wider text-[#a6baa9]">
                    FEATURED · {featuredOpp.category.toUpperCase()} · {featuredOpp.location.toUpperCase()}
                  </div>
                  <div className="lg:hidden flex gap-[10px]">
                    <div className="w-[30px] h-[30px] rounded-full border border-white/20 flex items-center justify-center text-white/50"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg></div>
                    <div className="w-[30px] h-[30px] rounded-full border border-white/20 flex items-center justify-center text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                  </div>
                </div>
                
                <h3 className="font-manrope text-[32px] lg:text-[48px] font-bold leading-none mb-[5px] tracking-tight">{featuredOpp.title}</h3>
                <div className="text-[14px] text-[#a6baa9] mb-[20px] lg:hidden">New for you</div>
                
                <div className="flex items-end gap-[10px] mb-[30px]">
                  <div className="font-manrope text-[56px] lg:text-[64px] font-bold text-[#a9e7bd] leading-none tracking-tighter">{featuredOpp.projectedReturn || '15%'}</div>
                  <div className="text-[13px] text-[#a6baa9] pb-[8px] leading-tight">projected /<br/>month</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-[15px] mb-[20px] lg:mb-[30px]">
                <div className="bg-white/5 border border-white/10 rounded-[12px] p-[15px] flex-1">
                  <div className="text-[10px] text-[#a6baa9] font-bold uppercase tracking-wider mb-[5px]">CLOSES IN</div>
                  <div className="font-mono text-[18px] font-bold text-white">
                    <CountdownTimer targetDate={cohort ? cohort.endDate : featuredOpp.createdAt} label="" />
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-[12px] p-[15px] flex-1">
                  <div className="text-[10px] text-[#a6baa9] font-bold uppercase tracking-wider mb-[5px]">[{Math.floor(Math.random() * 40) + 40}]% FUNDED</div>
                  <div className="w-full h-[6px] bg-white/10 rounded-full overflow-hidden mt-[10px]">
                    <div className="h-full bg-[#a9e7bd] w-[62%] rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-[15px] text-[13px] text-[#a6baa9]">
                <span>Min [{formatCurrency(minAmount)}]</span>
                <span>·</span>
                <span>Tenor [{featuredOpp.duration || 6} months]</span>
                <span>·</span>
                <Link href="#" className="underline hover:text-white">Terms & risks</Link>
              </div>
            </div>

            {/* Right Calculator Side (Desktop embedded, Mobile stacked) */}
            <div className="lg:w-[320px] shrink-0 bg-white rounded-[20px] p-[20px] lg:p-[25px] text-ink z-10">
              <div className="flex justify-between items-center mb-[15px]">
                <div className="lg:hidden text-[13px] text-[#68736d]">Choose amount</div>
                <div className="hidden lg:block text-[14px] font-bold">How much?</div>
                <div className="lg:hidden text-[11px] text-[#68736d]">Min [{formatCurrency(minAmount)}] · [{featuredOpp.duration || 6}] months</div>
              </div>

              <div className="grid grid-cols-2 gap-[10px] mb-[20px]">
                {amounts.map((amt) => (
                  <button 
                    key={amt}
                    onClick={() => setSelectedAmount(amt)}
                    className={`h-[45px] rounded-[10px] font-bold text-[14px] transition-all ${selectedAmount === amt ? 'bg-[#182a20] text-white' : 'border border-black/10 hover:border-[#008b45] text-ink'}`}
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
                <div className="flex justify-between text-[#68736d]">
                  <span>Projected monthly</span>
                  <strong className="text-[#008b45]">≈ {formatCurrency(getProjectedMonthly(selectedAmount, featuredOpp))}</strong>
                </div>
                <div className="flex justify-between text-[#68736d]">
                  <span>Pay with</span>
                  <strong className="text-ink">Transfer or card</strong>
                </div>
              </div>

              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="w-full h-[55px] bg-[#a9e7bd] hover:bg-[#86e2a6] text-[#182a20] font-bold text-[16px] rounded-[12px] flex items-center justify-center gap-[10px] transition-colors"
              >
                Acquire {formatCurrency(selectedAmount).replace('.00', '').replace('NGN', '₦')}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>

              <div className="lg:hidden flex justify-between items-center mt-[15px] text-[12px]">
                <span className="text-[#68736d]">≈ {formatCurrency(getProjectedMonthly(selectedAmount, featuredOpp))}/month, projected</span>
                <Link href="#" className="text-[#008b45] underline font-bold">Terms & risks</Link>
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

          <div className="bg-[#f7f9f7] rounded-[16px] p-[20px] mb-[40px]">
            <div className="text-[12px] text-[#68736d] font-bold mb-[5px]">Next payout</div>
            <div className="font-bold text-ink text-[16px]">≈ ₦15,000 · [12 Oct]</div>
          </div>

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

      {/* Bottom Lists Area (Desktop) */}
      <div className="hidden lg:grid grid-cols-12 gap-[30px]">
        {/* Also Open */}
        <div className="col-span-8">
          <div className="flex items-center justify-between mb-[20px]">
            <h2 className="font-manrope text-[24px] tracking-[-0.03em] font-bold text-ink">Also open</h2>
            <Link href="/explore" className="text-[14px] font-bold text-[#008b45] hover:underline">Browse marketplace</Link>
          </div>
          <div className="flex gap-[20px] overflow-x-auto pb-[20px] scrollbar-hide">
            {/* Open Farms */}
            {openFarms.map((opp: any) => {
              const owned = user.holdings?.find((h:any) => h.opportunityId === opp.id);
              return (
                <div key={opp.id} className="w-[280px] shrink-0 bg-white border border-black/5 rounded-[20px] p-[20px] shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-[15px]">
                      <div className="text-[10px] text-[#68736d] font-bold uppercase tracking-wider">FARM · {opp.location.toUpperCase()}</div>
                      {owned && (
                        <div className="bg-[#eef3ef] text-[#008b45] text-[10px] font-bold px-[8px] py-[4px] rounded-[6px] text-center leading-tight">
                          You own<br/>{formatCurrency(owned.totalAmount).replace('.00', '')}
                        </div>
                      )}
                    </div>
                    <h3 className="font-manrope font-bold text-[20px] text-ink mb-[10px] leading-tight">{opp.title}</h3>
                    <div className="font-bold text-[24px] text-[#008b45] leading-none mb-[15px]">{opp.projectedReturn || '15%'} <span className="text-[13px] text-[#68736d] font-normal">/ month</span></div>
                    <div className="text-[12px] text-[#68736d] mb-[20px]">Closes in 8d 0h 30m</div>
                  </div>
                  <button className="w-full h-[40px] bg-[#182a20] text-white text-[13px] font-bold rounded-full hover:bg-black transition-colors">
                    {owned ? 'Add to position' : 'Acquire'}
                  </button>
                </div>
              );
            })}

            {/* Land Empty/Active State */}
            {openLands.length === 0 ? (
              <div className="w-[280px] shrink-0 bg-[#f7f9f7] border border-black/5 border-dashed rounded-[20px] p-[20px] flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-[#68736d] font-bold uppercase tracking-wider mb-[15px]">LAND</div>
                  <h3 className="font-manrope font-bold text-[20px] text-ink mb-[10px] leading-tight">No open listings</h3>
                  <p className="text-[13px] text-[#68736d] leading-relaxed">Be first in line when the next land parcel goes live.</p>
                </div>
                <button className="w-full h-[40px] bg-white border border-black/10 text-ink text-[13px] font-bold rounded-full hover:border-[#008b45] transition-colors mt-[20px]">
                  Notify me
                </button>
              </div>
            ) : (
              openLands.map((opp: any) => (
                <div key={opp.id} className="w-[280px] shrink-0 bg-white border border-black/5 rounded-[20px] p-[20px] shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-[#68736d] font-bold uppercase tracking-wider mb-[15px]">LAND · {opp.location.toUpperCase()}</div>
                    <h3 className="font-manrope font-bold text-[20px] text-ink mb-[10px] leading-tight">{opp.title}</h3>
                    <div className="font-bold text-[20px] text-ink leading-none mb-[15px]">{formatCurrency(opp.pricePerUnit)}</div>
                  </div>
                  <button className="w-full h-[40px] bg-[#182a20] text-white text-[13px] font-bold rounded-full hover:bg-black transition-colors">
                    Buy land
                  </button>
                </div>
              ))
            )}

            {/* Land Banking Empty/Active State */}
            {openLandBanking.length === 0 ? (
              <div className="w-[280px] shrink-0 bg-[#f7f9f7] border border-black/5 border-dashed rounded-[20px] p-[20px] flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-[#68736d] font-bold uppercase tracking-wider mb-[15px]">LAND BANKING</div>
                  <h3 className="font-manrope font-bold text-[20px] text-ink mb-[10px] leading-tight">No open listings</h3>
                  <p className="text-[13px] text-[#68736d] leading-relaxed">We'll alert you the moment a land-banking cycle opens.</p>
                </div>
                <button className="w-full h-[40px] bg-white border border-black/10 text-ink text-[13px] font-bold rounded-full hover:border-[#008b45] transition-colors mt-[20px]">
                  Notify me
                </button>
              </div>
            ) : (
              openLandBanking.map((opp: any) => (
                <div key={opp.id} className="w-[280px] shrink-0 bg-white border border-black/5 rounded-[20px] p-[20px] shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-[#68736d] font-bold uppercase tracking-wider mb-[15px]">LAND BANKING</div>
                    <h3 className="font-manrope font-bold text-[20px] text-ink mb-[10px] leading-tight">{opp.title}</h3>
                    <div className="font-bold text-[20px] text-ink leading-none mb-[15px]">{formatCurrency(opp.pricePerUnit)}</div>
                  </div>
                  <button className="w-full h-[40px] bg-[#182a20] text-white text-[13px] font-bold rounded-full hover:bg-black transition-colors">
                    Subscribe
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Holdings */}
        <div className="col-span-4">
          <div className="flex items-center justify-between mb-[20px]">
            <h2 className="font-manrope text-[24px] tracking-[-0.03em] font-bold text-ink">Holdings</h2>
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

      {/* Checkout Drawer Overlay */}
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
                  <strong className="text-ink">{featuredOpp?.title}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68736d]">You invest</span>
                  <strong className="text-ink">{formatCurrency(selectedAmount)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68736d]">Projected monthly</span>
                  <strong className="text-[#008b45]">≈ {formatCurrency(getProjectedMonthly(selectedAmount, featuredOpp))}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68736d]">Tenor</span>
                  <strong className="text-ink">[{featuredOpp?.duration || 6} months]</strong>
                </div>
              </div>

              <div className="mb-[15px] text-[13px] font-bold text-[#68736d]">Pay with</div>
              <div className="space-y-[10px] mb-[20px]">
                
                {/* Bank Transfer (Existing Offline Flow) */}
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

                {/* Wallet */}
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
                <input type="hidden" name="opportunityId" value={featuredOpp?.id} />
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
