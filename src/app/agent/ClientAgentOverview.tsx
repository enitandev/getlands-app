"use client";
import React from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/mockData';
import ReferralLinkCard from './ReferralLinkCard';

export default function ClientAgentOverview({ user, networkCount, pendingCommissions, availableCommissions, recentCommissions }: any) {
  
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
              <button disabled className="h-[45px] px-[24px] bg-white/10 text-white/50 font-bold text-[14px] rounded-full cursor-not-allowed w-fit">
                Withdraw
              </button>
              <p className="text-[12px] text-[#a6baa9]">Commission payouts to your wallet are opening soon.</p>
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
              {networkCount} Clients & Agents
            </div>
            <Link href="/agent/network" className="text-[#008b45] text-[13px] font-bold flex items-center gap-[5px] hover:underline">
              View network pipeline
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
        
      </div>

      {/* Referral Link */}
      <ReferralLinkCard code={user.referralCode} />

      {/* Recent Commissions */}
      <div>
        <h2 className="font-manrope text-[20px] font-bold text-ink mb-[20px]">Recent Commissions</h2>
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
