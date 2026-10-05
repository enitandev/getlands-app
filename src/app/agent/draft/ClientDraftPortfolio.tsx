"use client";
import React, { useState } from 'react';
import { formatCurrency } from '@/lib/mockData';
import { draftPortfolioAction } from '@/app/actions/agent';

export default function ClientDraftPortfolio({ clients, opportunities, returnPlans }: any) {
  const [selectedOppId, setSelectedOppId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);

  const selectedOpp = opportunities.find((o: any) => o.id === selectedOppId);
  const isFarm = selectedOpp?.category === 'farm';
  const minAmount = selectedOpp ? (selectedOpp.slotPrice || selectedOpp.price || selectedOpp.acquisitionPrice || 50000) : 0;
  
  const [amount, setAmount] = useState<number>(minAmount);

  // When opp changes, reset amount to its min
  const handleOppChange = (e: any) => {
    const oppId = e.target.value;
    setSelectedOppId(oppId);
    const opp = opportunities.find((o: any) => o.id === oppId);
    if (opp) {
      setAmount(opp.slotPrice || opp.price || opp.acquisitionPrice || 50000);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await draftPortfolioAction(fd);
      if (res.success) {
        setSuccessRef(res.referenceCode);
      }
    } catch (err) {
      alert("Error drafting portfolio");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successRef) {
    return (
      <div className="flex flex-col h-[calc(100dvh-165px)] lg:h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide pb-[20px] lg:pb-[50px] items-center justify-center">
        <div className="bg-white rounded-[24px] p-[40px] border border-black/5 max-w-[500px] w-full text-center">
          <div className="w-[80px] h-[80px] bg-[#eef3ef] text-[#008b45] rounded-full flex items-center justify-center mx-auto mb-[20px]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h2 className="font-manrope text-[24px] font-bold text-ink mb-[10px]">Draft Created</h2>
          <p className="text-[14px] text-[#68736d] mb-[20px]">
            The portfolio has been prepared for your client. To activate it via offline payment, instruct your client to transfer the funds and include this reference code in the bank narration:
          </p>
          <div className="bg-[#f7f9f7] rounded-[12px] p-[20px] border border-black/10 mb-[30px]">
            <div className="font-mono text-[28px] font-bold tracking-widest text-[#008b45]">{successRef}</div>
          </div>
          <button onClick={() => setSuccessRef(null)} className="h-[50px] px-[30px] bg-[#182a20] text-white font-bold rounded-full hover:bg-black transition-colors">
            Draft Another Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-165px)] lg:h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide pb-[20px] lg:pb-[50px]">
      <header className="mb-[30px] shrink-0">
        <h1 className="font-manrope text-[28px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-tight mb-[5px]">Draft Portfolio</h1>
        <p className="text-[14px] text-[#68736d]">Prepare an acquisition for a client in your network.</p>
      </header>

      <div className="bg-white rounded-[24px] p-[30px] lg:p-[40px] border border-black/5 max-w-[600px]">
        {clients.length === 0 ? (
          <div className="text-center py-[20px]">
            <p className="text-[#68736d] text-[14px] mb-[15px]">You don't have any clients in your network yet.</p>
            <p className="text-[#68736d] text-[14px]">Share your Customer Referral Link to build your pipeline before drafting portfolios.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-[20px]">
            
            <div>
              <label className="block text-[13px] font-bold text-ink mb-[8px]">Select Client</label>
              <select name="clientId" required className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none border border-transparent focus:border-[#008b45] text-[14px]">
                <option value="">-- Choose a client --</option>
                {clients.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.email})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-ink mb-[8px]">Select Opportunity</label>
              <select name="opportunityId" required value={selectedOppId} onChange={handleOppChange} className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none border border-transparent focus:border-[#008b45] text-[14px]">
                <option value="">-- Choose an opportunity --</option>
                {opportunities.map((o: any) => (
                  <option key={o.id} value={o.id}>{o.title}</option>
                ))}
              </select>
            </div>

            {selectedOppId && isFarm && (
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Return Plan</label>
                <select name="planId" required className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none border border-transparent focus:border-[#008b45] text-[14px]">
                  {returnPlans.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.ratePercent}% ({p.name})</option>
                  ))}
                </select>
              </div>
            )}

            {selectedOppId && (
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Amount (₦)</label>
                <div className="flex gap-[10px]">
                  <button type="button" onClick={() => setAmount(Math.max(minAmount, amount - minAmount))} className="w-[50px] h-[50px] bg-[#f7f9f7] rounded-[12px] flex items-center justify-center font-bold text-ink hover:bg-[#eef3ef]">-</button>
                  <input type="number" name="amount" required readOnly value={amount} className="flex-1 h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none border border-transparent text-center font-bold text-[16px]" />
                  <button type="button" onClick={() => setAmount(amount + minAmount)} className="w-[50px] h-[50px] bg-[#f7f9f7] rounded-[12px] flex items-center justify-center font-bold text-ink hover:bg-[#eef3ef]">+</button>
                </div>
                <p className="text-[12px] text-[#7a847f] mt-[8px]">Minimum: {formatCurrency(minAmount)}</p>
              </div>
            )}

            <button disabled={isSubmitting || !selectedOppId} type="submit" className="w-full h-[55px] bg-[#008b45] hover:bg-[#007339] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[16px] rounded-[12px] mt-[10px] transition-colors shadow-lg">
              {isSubmitting ? 'Drafting...' : 'Generate Draft & Reference'}
            </button>

          </form>
        )}
      </div>
    </div>
  );
}
