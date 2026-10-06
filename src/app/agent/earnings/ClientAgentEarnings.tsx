"use client";
import React, { useState } from 'react';
import { formatCurrency } from '@/lib/mockData';
import Link from 'next/link';

export default function ClientAgentEarnings({ commissions, pendingTotal, paidTotal }: any) {
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, PAID, VOID

  const filtered = filter === 'ALL' ? commissions : commissions.filter((c: any) => c.status === filter);

  return (
    <div className="flex flex-col h-[calc(100dvh-165px)] lg:h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide pb-[20px] lg:pb-[50px]">
      
      {/* Header */}
      <header className="mb-[30px] shrink-0">
        <h1 className="font-manrope text-[28px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-tight mb-[5px]">Commission Ledger</h1>
        <p className="text-[14px] text-[#68736d]">Track your earnings, escrow periods, and payouts.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] mb-[30px] shrink-0">
        <div className="bg-[#182a20] rounded-[24px] p-[25px] flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#008b45] rounded-full blur-[60px] opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
          <h2 className="text-[#a6baa9] text-[13px] font-bold tracking-wider uppercase mb-[5px] relative z-10">Available (Paid to Wallet)</h2>
          <div className="text-[32px] font-manrope font-bold text-white leading-none mb-[15px] relative z-10">
            {formatCurrency(paidTotal)}
          </div>
          <Link href="/dashboard/wallet" className="h-[40px] px-[20px] bg-[#008b45] text-white text-[13px] font-bold rounded-full w-fit flex items-center justify-center hover:bg-[#007339] transition-colors relative z-10 shadow-lg">
            Withdraw to Bank
          </Link>
        </div>
        
        <div className="bg-amber-50 border border-amber-100 rounded-[24px] p-[25px] flex flex-col justify-center">
          <h2 className="text-amber-800 text-[13px] font-bold tracking-wider uppercase mb-[5px]">In Escrow (Pending)</h2>
          <div className="text-[32px] font-manrope font-bold text-amber-600 leading-none mb-[10px]">
            {formatCurrency(pendingTotal)}
          </div>
          <p className="text-[12px] text-amber-700/70">Commissions unlock 7 days after the client acquires a property.</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="flex-1 bg-white border border-black/5 rounded-[24px] overflow-hidden flex flex-col min-h-[400px]">
        {/* Filters */}
        <div className="p-[20px] border-b border-black/5 flex gap-[10px] overflow-x-auto scrollbar-hide">
          {['ALL', 'PENDING', 'PAID', 'VOID'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-[16px] py-[8px] rounded-full text-[12px] font-bold whitespace-nowrap transition-colors ${
                filter === f 
                  ? 'bg-ink text-white' 
                  : 'bg-[#f7f9f7] text-[#68736d] hover:bg-[#eef3ef]'
              }`}
            >
              {f === 'ALL' ? 'All Commissions' : f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-[60px] text-center">
              <div className="w-[60px] h-[60px] bg-[#f7f9f7] rounded-full mx-auto flex items-center justify-center text-[#a1aba6] mb-[20px]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              </div>
              <h3 className="text-[16px] font-bold text-ink mb-[5px]">No commissions found</h3>
              <p className="text-[13px] text-[#68736d]">No commissions match this filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {filtered.map((comm: any) => {
                const date = new Date(comm.createdAt);
                
                // Calculate unlock date for PENDING
                const unlockDate = new Date(date);
                unlockDate.setDate(unlockDate.getDate() + 7);
                const isUnlockingSoon = comm.status === 'PENDING';
                
                return (
                  <div key={comm.id} className="p-[20px] flex flex-col md:flex-row md:items-center justify-between gap-[15px] hover:bg-[#fcfdfc] transition-colors">
                    <div className="flex items-start gap-[15px]">
                      <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 ${
                        comm.status === 'PAID' ? 'bg-green-100 text-green-700' :
                        comm.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        T{comm.tierLevel}
                      </div>
                      <div>
                        <div className="font-bold text-[14px] text-ink mb-[2px]">
                          Tier {comm.tierLevel} Commission
                        </div>
                        <div className="text-[12px] text-[#68736d]">
                          Holding: <span className="font-mono text-ink">{comm.holding?.referenceCode || 'N/A'}</span>
                          {comm.holding?.opportunity?.title && ` - ${comm.holding.opportunity.title}`}
                        </div>
                        <div className="text-[11px] text-[#a1aba6] mt-[4px]">
                          Earned: {date.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center md:flex-col md:items-end justify-between ml-[55px] md:ml-0 gap-[10px]">
                      <div className="text-right">
                        <div className={`font-bold text-[16px] ${comm.status === 'VOID' ? 'text-[#a1aba6] line-through' : 'text-ink'}`}>
                          {formatCurrency(comm.amount)}
                        </div>
                        <div className={`text-[10px] font-bold uppercase tracking-wider mt-[4px] ${
                          comm.status === 'PAID' ? 'text-green-600' :
                          comm.status === 'PENDING' ? 'text-amber-600' :
                          'text-red-500'
                        }`}>
                          {comm.status}
                        </div>
                      </div>
                      
                      {isUnlockingSoon && (
                        <div className="text-[11px] bg-amber-50 text-amber-700 px-[8px] py-[4px] rounded-md flex items-center gap-[4px] border border-amber-100 whitespace-nowrap">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          Unlocks {unlockDate.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
