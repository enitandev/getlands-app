"use client";
import React from 'react';
import Link from 'next/link';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { formatCurrency } from '@/lib/mockData';
import { Button } from '@/components/ui/Button';

export default function ClientDashboardOverview({ user, activeAnnouncement, featuredOpps = [] }: { user: any, activeAnnouncement: any, featuredOpps?: any[] }) {
  const totalValue = user.holdings.reduce((sum: number, h: any) => sum + h.totalAmount, 0);
  
  if (!user.holdings || user.holdings.length === 0) {
    return (
      <div className="space-y-[40px] animate-fade-in">
        <section>
          <div className="text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase mb-[10px]">MY GETLANDS</div>
          <h1 className="font-manrope text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none mb-[20px]">
            Welcome, {user.firstName}.
          </h1>
          <p className="text-[16px] text-[#68736d] max-w-[500px]">Your portfolio starts here.</p>
        </section>

        <section className="bg-[#102218] text-white rounded-[24px] p-[30px] lg:p-[40px] shadow-[0_20px_50px_rgba(16,34,24,0.1)] relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-[30px]">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#008b45] rounded-full blur-[100px] opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 max-w-[400px]">
            <h2 className="font-manrope text-[24px] tracking-[-0.03em] mb-[10px]">Discover opportunities</h2>
            <p className="text-[14px] text-[#a6baa9] mb-[20px]">Land. Farms. Structured opportunities. One marketplace to discover, acquire, and manage what you own.</p>
            <Link href="/explore" className="inline-block px-[24px] py-[14px] bg-[#008b45] text-white rounded-full font-bold text-[14px] hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.3)]">
              Explore Marketplace
            </Link>
          </div>
          
          <div className="relative z-10 flex overflow-x-auto snap-x snap-mandatory gap-[15px] shrink-0 pb-[10px] md:pb-0 scrollbar-hide md:grid md:grid-cols-2 w-full md:w-auto mt-[20px] md:mt-0">
             {featuredOpps.map((opp, i) => {
               const cohort = opp.cohorts && opp.cohorts.length > 0 ? opp.cohorts[0] : null;
               const status = cohort ? cohort.status : opp.status;
               let label = 'Featured';
               if (status === 'COMING_SOON') label = 'Upcoming';
               else if (status === 'PRE_ORDER') label = 'Pre-Order Open';
               
               return (
                 <Link href={`/explore/${opp.slug}`} key={opp.id} className="flex flex-col justify-between w-[200px] md:w-[240px] shrink-0 snap-center bg-[#182a20] border border-white/5 rounded-[16px] p-[20px] hover:bg-[#1d3326] hover:shadow-[0_10px_30px_rgba(0,139,69,0.15)] hover:-translate-y-[2px] transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-[#008b45] rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                    <div>
                      <div className="flex justify-between items-center mb-[10px]">
                        <div className="text-[10px] text-[#a6baa9] font-bold uppercase tracking-wider">{label}</div>
                        {cohort && (cohort.status === 'OPEN' || cohort.status === 'PRE_ORDER') && (
                          <div className="w-[6px] h-[6px] rounded-full bg-[#008b45] animate-pulse"></div>
                        )}
                      </div>
                      <div className="font-manrope text-[18px] text-white leading-tight mb-[15px]">{opp.title}</div>
                    </div>
                    
                    <div className="border-t border-white/10 pt-[15px]">
                      {opp.category === 'farm' && opp.projectedReturn ? (
                        <div>
                          <strong className="block font-manrope text-[24px] text-[#a9e7bd] leading-none mb-[2px]">{opp.projectedReturn}</strong>
                          <span className="text-[11px] text-[#a6baa9] uppercase tracking-wider">{opp.returnsFrequency || 'Target Return'}</span>
                        </div>
                      ) : opp.category === 'land_banking' && opp.duration ? (
                        <div>
                          <strong className="block font-manrope text-[24px] text-[#a9e7bd] leading-none mb-[2px]">{opp.duration} Months</strong>
                          <span className="text-[11px] text-[#a6baa9] uppercase tracking-wider">Holding Period</span>
                        </div>
                      ) : opp.price ? (
                        <div>
                          <strong className="block font-manrope text-[20px] text-[#a9e7bd] leading-none mb-[2px]">₦{opp.price.toLocaleString()}</strong>
                          <span className="text-[11px] text-[#a6baa9] uppercase tracking-wider">Starting Price</span>
                        </div>
                      ) : null}
                    </div>

                    {cohort && cohort.status === 'OPEN' && cohort.closesAt && (
                      <div className="mt-[10px] -mb-[5px]">
                        <CountdownTimer targetDate={cohort.closesAt} label="CLOSES IN" />
                      </div>
                    )}
                    {cohort && (cohort.status === 'PRE_ORDER' || cohort.status === 'COMING_SOON') && (cohort.publicOpensAt || cohort.preorderOpensAt) && (
                      <div className="mt-[10px] -mb-[5px]">
                        <CountdownTimer targetDate={cohort.publicOpensAt || cohort.preorderOpensAt} label="OPENS IN" />
                      </div>
                    )}
                 </Link>
               );
             })}
             
             {featuredOpps.length === 0 && (
               <div className="bg-white/5 border border-white/10 rounded-[16px] p-[20px] backdrop-blur-md">
                  <div className="text-[11px] text-[#a6baa9] font-bold uppercase tracking-wider mb-[5px]">Featured</div>
                  <div className="font-manrope text-[16px] text-white leading-tight">New opportunities loading...</div>
               </div>
             )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-[40px]">
      {activeAnnouncement && (
        <div className="bg-[#008b45] text-white p-[20px] rounded-[16px] shadow-[0_10px_30px_rgba(0,139,69,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-[15px] animate-fade-in">
          <div className="flex gap-[15px] items-center">
            <div className="w-[40px] h-[40px] rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            </div>
            <div>
              <strong className="block text-[15px] mb-[2px]">{activeAnnouncement.title}</strong>
              <span className="text-[13px] text-white/80">{activeAnnouncement.message}</span>
            </div>
          </div>
          <Link href="/explore" className="px-[20px] py-[10px] bg-white text-[#008b45] text-[12px] font-bold rounded-full whitespace-nowrap text-center hover:bg-[#f7f9f7] transition-colors">
            View Details
          </Link>
        </div>
      )}

      <section>
        <div className="text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase mb-[10px]">MY GETLANDS</div>
        <h1 className="font-manrope text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none mb-[20px]">
          Welcome back, {user.firstName}.
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px]">
          {/* Main Portfolio Box */}
          <div className="lg:col-span-2 bg-[#102218] text-white rounded-[24px] p-[30px] lg:p-[40px] shadow-[0_20px_50px_rgba(16,34,24,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#008b45] rounded-full blur-[80px] opacity-20 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            <div className="text-[13px] text-[#a6baa9] mb-[5px] font-bold uppercase tracking-wider">Total Holdings</div>
            <div className="font-manrope text-[48px] lg:text-[64px] tracking-[-0.05em] text-[#a9e7bd] leading-none mb-[30px]">
              {formatCurrency(totalValue)}
            </div>
          <div className="flex gap-[15px]">
            <div className="bg-white/10 px-[16px] py-[10px] rounded-full text-[12px] font-bold">
              {user.holdings.filter((h: any) => h.opportunity.category === 'land').length} Land
            </div>
            <div className="bg-white/10 px-[16px] py-[10px] rounded-full text-[12px] font-bold">
              {user.holdings.filter((h: any) => h.opportunity.category === 'farm').length} Farm Cycles
            </div>
            <div className="bg-white/10 px-[16px] py-[10px] rounded-full text-[12px] font-bold">
              {user.holdings.filter((h: any) => h.opportunity.category === 'land_banking').length} Land Banking
            </div>
          </div>
          </div>

          
          {/* Wallet Box */}
          <div className="bg-white border border-black/5 rounded-[24px] p-[30px] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-[5px]">
                <div className="text-[13px] text-[#68736d] font-bold">Wallet Balance</div>
                <div className="w-[32px] h-[32px] rounded-full bg-[#f7f9f7] flex items-center justify-center text-[#008b45]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                </div>
              </div>
              <div className="font-manrope text-[32px] lg:text-[40px] tracking-[-0.03em] text-ink font-bold leading-none mb-[10px]">
                {formatCurrency(user.walletBalance)}
              </div>
              <p className="text-[12px] text-[#7a847f]">Available for immediate investment.</p>
            </div>
            <Link href="/dashboard/wallet" className="block w-full py-[12px] bg-[#eef3ef] text-[#008b45] text-[13px] font-bold rounded-full text-center hover:bg-[#008b45] hover:text-white transition-colors mt-[20px]">
              Fund Wallet
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[30px] lg:gap-[40px]">
        <section className="lg:col-span-7">
          <div className="flex items-center justify-between mb-[20px]">
            <h2 className="font-manrope text-[24px] tracking-[-0.03em] text-ink">Recent Holdings</h2>
            <Link href="/dashboard/holdings" className="text-[13px] font-bold text-[#008b45] hover:underline">View all</Link>
          </div>
          
          <div className="space-y-[15px]">
            {user.holdings.slice(0, 3).map((holding: any) => (
              <Link key={holding.id} href={`/dashboard/holdings/${holding.id}`} className="bg-white border border-black/5 rounded-[20px] p-[20px] flex items-center justify-between hover:border-[#008b45]/30 transition-colors cursor-pointer block">
                <div className="flex gap-[20px] items-center">
                  <div className="w-[50px] h-[50px] rounded-full bg-[#eef3ef] text-[#008b45] flex items-center justify-center font-bold text-[10px] tracking-[0.1em] uppercase">
                    {holding.opportunity.category.substring(0, 4)}
                  </div>
                  <div>
                    <strong className="block text-[16px] text-ink">{holding.opportunity.title}</strong>
                    <span className="text-[12px] text-[#7a847f]">{holding.opportunity.location} · {holding.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <strong className="block text-[16px] text-ink">{formatCurrency(holding.total_amount)}</strong>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="lg:col-span-5">
          <h2 className="font-manrope text-[24px] tracking-[-0.03em] text-ink mb-[20px]">Needs Attention</h2>
          
          <div className="space-y-[15px]">
            {user.notifications.map((notification: any) => (
              <div key={notification.id} className="bg-white border border-black/5 rounded-[20px] p-[20px] shadow-sm">
                <div className="flex justify-between items-start mb-[10px]">
                  <span className="text-[10px] font-extrabold tracking-[0.1em] uppercase text-[#008b45]">
                    {'ALERT'}
                  </span>
                  <span className="text-[11px] text-[#a1aba6]">{new Date(notification.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <strong className="block text-[15px] text-ink mb-[5px]">{notification.title}</strong>
                <p className="text-[13px] text-[#68736d] m-0 mb-[15px] leading-[1.5]">
                  {notification.message}
                </p>
                <Button href="/dashboard/transactions" variant="light" className="!py-[10px] !px-[16px] !text-[12px]">View Details</Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
