"use client";
import React from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/mockData';
import ReferralLinkCard from './ReferralLinkCard';

export default function ClientAgentOverview({ user, networkCount, pendingCommissions, availableCommissions, recentCommissions, personalHoldings = [] }: any) {
  
  return (
    <div className="flex flex-col h-[calc(100dvh-165px)] lg:h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide pb-[20px] lg:pb-[50px]">
      
      {/* Header */}
      <header className="mb-[30px] shrink-0">
        <h1 className="font-manrope text-[28px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-tight mb-[5px]">Welcome back, {user.firstName}</h1>
        <p className="text-[14px] text-[#68736d]">Here is what is happening with your sales pipeline today.</p>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] mb-[40px] shrink-0">
        
        {/* Wallet Card */}
        <div className="lg:col-span-2 bg-[#182a20] rounded-[24px] p-[25px] lg:p-[40px] relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#008b45] rounded-full blur-[80px] opacity-20 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="relative z-10">
            <h2 className="text-[#a6baa9] text-[13px] font-bold tracking-wider uppercase mb-[10px]">Available Commissions</h2>
            <div className="text-[32px] lg:text-[48px] font-manrope font-bold text-white leading-none mb-[20px]">
              {formatCurrency(availableCommissions).replace('.00', '').replace('NGN', '₦')}
            </div>
            
            <div className="flex flex-col gap-[8px]">
              <Link href="/dashboard/wallet" className="h-[45px] px-[24px] bg-[#008b45] hover:bg-[#007339] text-white font-bold text-[14px] rounded-full transition-colors shadow-lg flex items-center justify-center w-fit">
                Withdraw to Bank
              </Link>
              <p className="text-[12px] text-[#a6baa9]">Commissions are paid directly to your main wallet.</p>
            </div>
          </div>
        </div>

        {/* Pending & Network */}
        <div className="flex flex-col gap-[20px]">
          <div className="bg-white border border-black/5 rounded-[24px] p-[25px] flex-1 flex flex-col justify-center">
            <h3 className="text-[#68736d] text-[13px] font-bold tracking-wider uppercase mb-[5px]">Pending Escrow</h3>
            <div className="text-[24px] font-manrope font-bold text-ink leading-none mb-[10px]">
              {formatCurrency(pendingCommissions).replace('.00', '').replace('NGN', '₦')}
            </div>
            <p className="text-[12px] text-[#7a847f]">Unlocks 7 days after client acquisition.</p>
          </div>
          
          <div className="bg-white border border-black/5 rounded-[24px] p-[25px] flex-1 flex flex-col justify-center relative overflow-hidden group">
            <h3 className="text-[#68736d] text-[13px] font-bold tracking-wider uppercase mb-[5px]">My Network</h3>
            <div className="text-[24px] font-manrope font-bold text-ink leading-none mb-[10px]">
              {networkCount} People
            </div>
            <div className="flex gap-[15px]">
              <Link href="/agent/network" className="text-[#008b45] text-[13px] font-bold flex items-center gap-[5px] hover:underline">
                Clients <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/agent/team" className="text-[#008b45] text-[13px] font-bold flex items-center gap-[5px] hover:underline">
                Sub-agents <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>
        
      </div>

      {/* Referral Link */}
      <div className="mb-[40px]">
        <ReferralLinkCard code={user.referralCode} />
      </div>

      {/* Personal Portfolio Section */}
      <div className="mb-[40px]">
        <div className="flex items-center justify-between mb-[20px]">
          <div>
            <h2 className="font-manrope text-[20px] font-bold text-ink">Personal Portfolio</h2>
            <p className="text-[13px] text-[#68736d]">Your active commodity trades, land acquisitions, and payout schedules.</p>
          </div>
          <Link href="/dashboard/holdings" className="text-[#008b45] text-[13px] font-bold hover:underline shrink-0">
            View full portfolio &rarr;
          </Link>
        </div>

        {personalHoldings.length === 0 ? (
          <div className="bg-white border border-black/5 rounded-[20px] p-[30px] flex flex-col sm:flex-row items-center justify-between gap-[20px]">
            <div>
              <strong className="block text-[14px] text-ink mb-[4px]">No active personal holdings</strong>
              <p className="text-[13px] text-[#68736d]">You have not subscribed to any commodity trades or land banking opportunities under this account yet.</p>
            </div>
            <Link 
              href="/dashboard/marketplace" 
              className="px-[20px] py-[10px] bg-[#eef3ef] hover:bg-[#008b45] text-[#008b45] hover:text-white font-bold text-[13px] rounded-full transition-colors whitespace-nowrap"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-black/5 rounded-[20px] overflow-hidden divide-y divide-black/5 shadow-sm">
            {personalHoldings.map((h: any) => {
              const nextPayout = h.payouts?.find((p: any) => p.status === 'PENDING');
              return (
                <div key={h.id} className="p-[20px] lg:p-[24px] flex flex-col md:flex-row md:items-center justify-between gap-[15px] hover:bg-[#fcfdfc] transition-colors">
                  <div className="flex items-center gap-[15px]">
                    <div className="w-[44px] h-[44px] rounded-[12px] bg-[#eef3ef] flex items-center justify-center text-[#008b45] shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-[8px] flex-wrap">
                        <strong className="text-[15px] text-ink">{h.opportunity?.title || 'Investment Holding'}</strong>
                        <span className="bg-[#eef3ef] text-[#008b45] text-[10px] font-bold px-[8px] py-[2px] rounded-full uppercase tracking-wider">
                          {h.status}
                        </span>
                        {h.planName && (
                          <span className="bg-black/5 text-[#555] text-[10px] font-bold px-[8px] py-[2px] rounded-full">
                            {h.planName}
                          </span>
                        )}
                        {h.ratePercent && !h.planName && (
                          <span className="bg-black/5 text-[#555] text-[10px] font-bold px-[8px] py-[2px] rounded-full">
                            {h.ratePercent}% ROI
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-[#68736d] mt-[4px]">
                        Acquired {new Date(h.dateAcquired).toLocaleDateString()} • {h.units} {h.units === 1 ? 'Unit' : 'Units'}
                        {h.maturityDate && (
                          <span> • Maturity: {new Date(h.maturityDate).toLocaleDateString()}</span>
                        )}
                        {nextPayout && (
                          <span className="text-[#008b45] font-semibold"> • Next Payout: {formatCurrency(nextPayout.amount)} ({new Date(nextPayout.dueDate).toLocaleDateString()})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-[20px] pt-[10px] md:pt-0 border-t md:border-t-0 border-black/5">
                    <div className="md:text-right">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a847f] block">Subscribed Value</span>
                      <strong className="text-[16px] font-manrope text-ink">{formatCurrency(h.totalAmount)}</strong>
                    </div>
                    <Link
                      href="/dashboard/holdings"
                      className="px-[14px] py-[8px] bg-white border border-black/10 hover:border-[#008b45] text-ink hover:text-[#008b45] text-[12px] font-bold rounded-full transition-colors whitespace-nowrap"
                    >
                      View Documents
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Commissions */}
      <div>
        <div className="flex items-center justify-between mb-[20px]">
          <h2 className="font-manrope text-[20px] font-bold text-ink">Recent Commissions</h2>
          <Link href="/agent/earnings" className="text-[#008b45] text-[13px] font-bold hover:underline">
            View full ledger &rarr;
          </Link>
        </div>
        <div className="bg-white border border-black/5 rounded-[20px] overflow-hidden">
          {recentCommissions.length === 0 ? (
            <div className="p-[40px] text-center">
              <div className="text-[14px] font-bold text-ink mb-[5px]">No commissions yet</div>
              <p className="text-[13px] text-[#68736d]">Start sharing your links to build your pipeline.</p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {recentCommissions.map((comm: any) => (
                <div key={comm.id} className="p-[20px] flex items-center justify-between">
                  <div className="flex items-center gap-[15px]">
                    <div className="w-[40px] h-[40px] rounded-full bg-[#f7f9f7] flex items-center justify-center text-[#008b45] font-bold text-[14px]">
                      T{comm.tierLevel}
                    </div>
                    <div>
                      <div className="font-bold text-[14px] text-ink">Tier {comm.tierLevel} Commission</div>
                      <div className="text-[12px] text-[#68736d]">{new Date(comm.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[15px] text-ink">{formatCurrency(comm.amount)}</div>
                    <div className={`text-[11px] font-bold uppercase tracking-wider ${comm.status === 'PAID' ? 'text-[#008b45]' : 'text-[#f5a623]'}`}>
                      {comm.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
