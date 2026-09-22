"use client";
import React, { useState } from 'react';
import { recordLegacyReferralAction } from '@/app/actions/admin-legacy-referral';
import { toast } from '@/components/ui/Toast';

export function LegacyReferralModal({ referredUserId }: { referredUserId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    fd.append('referredUserId', referredUserId);
    
    const res = await recordLegacyReferralAction(fd);
    setLoading(false);
    
    if (res.error) {
      toast(res.error, 'error');
    } else {
      toast('Legacy referral recorded successfully!', 'success');
      setIsOpen(false);
    }
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="px-[16px] py-[8px] bg-white border border-black/10 text-ink text-[12px] font-bold rounded-full hover:bg-[#f7f9f7] transition-colors">
        Record Legacy Referral
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-[20px] bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-[400px] rounded-[24px] p-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative" onClick={e => e.stopPropagation()}>
        <button onClick={() => setIsOpen(false)} className="absolute top-[20px] right-[20px] w-[30px] h-[30px] rounded-full bg-[#f7f9f7] flex items-center justify-center hover:bg-[#eef3ef] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        
        <h2 className="font-manrope text-[20px] font-bold text-ink mb-[5px]">Legacy Referral</h2>
        <p className="text-[13px] text-[#68736d] mb-[20px] leading-relaxed">
          Link this customer to their referrer. This logs the offline payout to the referrer's ledger without inflating their withdrawable wallet balance.
        </p>

        <form onSubmit={onSubmit} className="space-y-[15px]">
          <div>
            <label className="block text-[12px] font-bold text-ink uppercase tracking-wider mb-[5px]">Referrer's Code</label>
            <input type="text" name="referrerCode" placeholder="e.g. ENI-4F2A" required className="w-full bg-[#f7f9f7] border border-black/5 rounded-[12px] p-[12px_16px] outline-none focus:border-[#008b45] transition-colors text-[14px]" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-ink uppercase tracking-wider mb-[5px]">Amount Paid Offline (₦)</label>
            <input type="number" name="amountPaidOffline" placeholder="0" required className="w-full bg-[#f7f9f7] border border-black/5 rounded-[12px] p-[12px_16px] outline-none focus:border-[#008b45] transition-colors text-[14px]" />
          </div>
          
          <button type="submit" disabled={loading} className="w-full py-[14px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)] disabled:opacity-50 mt-[10px]">
            {loading ? 'Processing...' : 'Record Payout'}
          </button>
        </form>
      </div>
    </div>
  );
}
