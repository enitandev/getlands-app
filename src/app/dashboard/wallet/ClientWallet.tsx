"use client";
import React, { useState } from 'react';
import { mockWallet, formatCurrency } from '@/lib/mockData';

import { fundWalletAction } from '@/app/actions/checkout';
export default function ClientWallet({ balance, transactions }: { balance: number, transactions: any[] }) {
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);

  return (
    <div className="space-y-[40px] max-w-[1000px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[20px]">
        <div>
          <div className="text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase mb-[10px]">MY GETLANDS</div>
          <h1 className="font-manrope text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none mb-[10px]">
            Wallet
          </h1>
          <p className="text-[14px] text-[#68736d]">Manage your liquid funds for instant acquisitions.</p>
        </div>
      </div>

      <div className="bg-[#102218] rounded-[24px] p-[30px] lg:p-[40px] text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-[30px]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#008b45] rounded-full blur-[100px] opacity-20 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10">
          <div className="text-[13px] text-[#8ea096] mb-[5px] font-bold uppercase tracking-[0.05em]">Available Balance</div>
          <div className="font-manrope text-[48px] lg:text-[64px] tracking-[-0.03em] font-bold text-[#a9e7bd] leading-none">
            {formatCurrency(balance)}
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-[15px] w-full md:w-auto">
          <button onClick={() => setIsFundModalOpen(true)} className="px-[30px] py-[16px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.3)] whitespace-nowrap">
            Fund Wallet
          </button>
          <button className="px-[30px] py-[16px] bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors whitespace-nowrap" onClick={() => alert('Withdrawals are processed to your saved bank account.')}>
            Withdraw
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
        <div className="p-[20px] lg:p-[30px] border-b border-black/5 bg-[#fcfdfc]">
          <h2 className="font-manrope text-[18px] lg:text-[20px] font-bold text-ink">Wallet History</h2>
        </div>
        
        <div className="divide-y divide-black/5">
          {transactions.map(tx => (
            <div key={tx.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_100px] gap-[15px] p-[20px] lg:p-[20px_30px] items-center hover:bg-[#fcfdfc] transition-colors">
              <div className="flex gap-[15px] items-center">
                <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 ${
                  tx.type === 'deposit' ? 'bg-[#eef3ef] text-[#008b45]' : 'bg-[#fdeeee] text-[#e53935]'
                }`}>
                  {tx.type === 'deposit' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  )}
                </div>
                <div>
                  <strong className="block text-[15px] text-ink capitalize">{tx.type}</strong>
                  <span className="text-[12px] text-[#7a847f] font-mono">{tx.ref}</span>
                </div>
              </div>
              
              <div className="text-[13px] text-[#68736d]">
                {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
              
              <div className="text-right">
                <strong className={`block text-[16px] ${tx.type === 'deposit' ? 'text-[#008b45]' : 'text-ink'}`}>
                  {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isFundModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl overflow-hidden">
            <div className="p-[20px] lg:p-[30px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
              <h2 className="font-manrope text-[18px] lg:text-[20px] font-bold text-ink">Fund Wallet</h2>
              <button onClick={() => setIsFundModalOpen(false)} className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center hover:bg-[#eef3ef] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <form className="p-[20px] lg:p-[30px] space-y-[20px]" action={async (formData) => { await fundWalletAction(formData);  }}>
              <div className="bg-[#f7f9f7] rounded-[16px] p-[20px] border border-black/5">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#7a847f] mb-[15px]">Bank Transfer Details</h3>
                <div className="space-y-[15px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-[#68736d]">Bank Name</span>
                    <strong className="text-[14px] text-ink">Moniepoint MFB</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-[#68736d]">Account Name</span>
                    <strong className="text-[14px] text-ink">GETLANDS LIMITED</strong>
                  </div>
                  <div className="flex justify-between items-center bg-white p-[10px] rounded-[8px] border border-black/5">
                    <strong className="text-[20px] font-mono text-ink tracking-widest">9133485636</strong>
                    <button className="text-[12px] font-bold text-[#008b45] hover:underline" onClick={() => alert('Account number copied!')}>Copy</button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Amount Sent</label>
                <div className="relative">
                  <span className="absolute left-[15px] top-1/2 -translate-y-1/2 font-manrope font-bold text-[#68736d]">₦</span>
                  <input type="number" name="amount" placeholder="0.00" required className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] pl-[35px] pr-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors font-manrope font-bold text-[16px]" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Upload Payment Receipt</label>
                <div className="border-2 border-dashed border-black/10 rounded-[12px] p-[30px] text-center hover:bg-[#f7f9f7] hover:border-[#008b45]/50 transition-colors cursor-pointer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto text-[#008b45] mb-[10px]"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  <strong className="block text-[13px] text-ink mb-[2px]">Click to upload receipt</strong>
                  <span className="text-[11px] text-[#7a847f]">PNG, JPG or PDF (max. 5MB)</span>
                </div>
              </div>

              <div className="pt-[10px]">
                <button  className="w-full py-[14px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.25)]">
                  Submit Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
