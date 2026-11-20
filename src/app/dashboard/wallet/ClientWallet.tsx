"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/mockData';
import { fundWalletAction } from '@/app/actions/checkout';
import { requestWithdrawalAction } from '@/app/actions/wallet';
import { toast } from '@/components/ui/Toast';
import Link from 'next/link';

export default function ClientWallet({
  balance,
  transactions,
  bankAccounts,
  settlementFeePercent = 1.5,
  autoOpenWithdraw = false
}: {
  balance: number;
  transactions: any[];
  bankAccounts: any[];
  settlementFeePercent?: number;
  autoOpenWithdraw?: boolean;
}) {
  const router = useRouter();
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(autoOpenWithdraw);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [justSubmittedWithdrawal, setJustSubmittedWithdrawal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingWithdrawalRef = useRef(false);
  const [isSubmittingFund, setIsSubmittingFund] = useState(false);
  const isSubmittingFundRef = useRef(false);

  useEffect(() => {
    if (autoOpenWithdraw) {
      setIsWithdrawModalOpen(true);
    }
  }, [autoOpenWithdraw]);

  const activeBank = bankAccounts[0];
  const pendingWithdrawals = transactions.filter(
    t => t.type?.toLowerCase() === 'withdrawal' && t.status === 'pending'
  );

  const handleFundSubmit = async (formData: FormData) => {
    if (isSubmittingFundRef.current || isSubmittingFund) return;
    isSubmittingFundRef.current = true;
    setIsSubmittingFund(true);
    try {
      await fundWalletAction(formData);
      setIsFundModalOpen(false);
    } catch (err: any) {
      if (err?.message?.includes('NEXT_REDIRECT') || err?.digest?.includes('NEXT_REDIRECT')) {
        setIsFundModalOpen(false);
        return;
      }
      toast(err?.message || "Failed to submit deposit receipt", 'error');
    } finally {
      setIsSubmittingFund(false);
      isSubmittingFundRef.current = false;
    }
  };

  const handleWithdrawal = async (formData: FormData) => {
    if (isSubmittingWithdrawalRef.current || isSubmitting) return;
    isSubmittingWithdrawalRef.current = true;
    setIsSubmitting(true);
    setWithdrawError('');
    
    try {
      const res = await requestWithdrawalAction(formData);
      
      if (res.error) {
        setWithdrawError(res.error);
      } else {
        setIsWithdrawModalOpen(false);
        setWithdrawAmount('');
        setJustSubmittedWithdrawal(true);
        toast('Withdrawal request submitted! Payouts are processed to your bank account within 24 to 48 hours.', 'success');
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
      isSubmittingWithdrawalRef.current = false;
    }
  };

  return (
    <div className="space-y-[30px] max-w-[1000px] mx-auto pb-[40px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[20px]">
        <div>
          <div className="text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase mb-[10px]">MY GETLANDS</div>
          <h1 className="font-manrope text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none mb-[10px]">
            Wallet
          </h1>
          <p className="text-[14px] text-[#68736d]">Manage your liquid funds for instant acquisitions or bank withdrawals.</p>
        </div>
      </div>

      {/* Important Payout & Withdrawal Instructions Banner */}
      <div className="bg-[#fffbeb] border border-[#fde68a] rounded-[20px] p-[20px] lg:p-[24px] flex flex-col md:flex-row md:items-center justify-between gap-[16px] shadow-sm">
        <div className="flex items-start gap-[14px]">
          <div className="w-[40px] h-[40px] rounded-full bg-amber-500/15 text-amber-800 flex items-center justify-center shrink-0 mt-[2px]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div>
            <strong className="block text-[15px] text-[#78350f] font-manrope mb-[4px]">
              How to Receive Money in Your Bank Account (24 to 48 Hours Payout Policy)
            </strong>
            <p className="text-[13px] text-[#92400e] leading-relaxed">
              When your investment returns (ROI), matured capital, or referral commissions are paid to your Getlands Wallet, they stay in your wallet until you initiate a withdrawal (or reinvest them). <strong>To receive money in your personal bank account, you must click Withdraw and submit a withdrawal request.</strong> Bank payouts are made within <strong>24 to 48 hours</strong> after your withdrawal request is submitted.
            </p>
          </div>
        </div>
        {balance > 0 && (
          <button
            type="button"
            onClick={() => setIsWithdrawModalOpen(true)}
            className="px-[20px] py-[11px] bg-[#182a20] hover:bg-[#008b45] text-white text-[13px] font-bold rounded-full transition-colors whitespace-nowrap shrink-0 self-start md:self-center shadow-sm"
          >
            Withdraw to Bank &rarr;
          </button>
        )}
      </div>

      {justSubmittedWithdrawal && (
        <div className="bg-[#eef3ef] border-2 border-[#008b45] rounded-[20px] p-[20px] flex items-start justify-between gap-[15px] animate-fade-in">
          <div className="flex items-start gap-[12px]">
            <div className="w-[36px] h-[36px] rounded-full bg-[#008b45] text-white flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div>
              <strong className="block text-[15px] text-[#182a20] font-manrope">
                Withdrawal Request Received
              </strong>
              <p className="text-[13px] text-[#4a554f] mt-[2px]">
                Your withdrawal request is now queued with our finance team. Your funds will be transferred directly to your verified bank account within <strong>24 to 48 hours</strong>.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setJustSubmittedWithdrawal(false)}
            className="text-[12px] font-bold text-[#68736d] hover:text-ink"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Balance Card */}
      <div className="bg-[#102218] rounded-[24px] p-[30px] lg:p-[40px] text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-[30px]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#008b45] rounded-full blur-[100px] opacity-20 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10">
          <div className="text-[13px] text-[#8ea096] mb-[5px] font-bold uppercase tracking-[0.05em]">Available Wallet Balance</div>
          <div className="font-manrope text-[48px] lg:text-[64px] tracking-[-0.03em] font-bold text-[#a9e7bd] leading-none">
            {formatCurrency(balance)}
          </div>
          <p className="text-[12px] text-[#a6baa9] mt-[10px]">
            {balance > 0
              ? 'Click "Withdraw to Bank" to request a payout to your bank account (processed in 24 to 48 hours).'
              : 'Returns credited to your wallet can be withdrawn to your bank account or reinvested.'}
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-[15px] w-full md:w-auto">
          <button
            type="button"
            onClick={() => setIsWithdrawModalOpen(true)}
            className="px-[30px] py-[16px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.3)] whitespace-nowrap"
          >
            Withdraw to Bank
          </button>
          <button
            type="button"
            onClick={() => setIsFundModalOpen(true)}
            className="px-[30px] py-[16px] bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors whitespace-nowrap"
          >
            Fund Wallet
          </button>
        </div>
      </div>

      {/* Active Pending Withdrawal Requests Tracker */}
      {pendingWithdrawals.length > 0 && (
        <div className="bg-white rounded-[24px] border-2 border-[#008b45]/25 shadow-sm overflow-hidden">
          <div className="p-[20px] lg:p-[24px_30px] border-b border-black/5 bg-[#fcfdfc] flex flex-col sm:flex-row sm:items-center justify-between gap-[10px]">
            <div>
              <div className="flex items-center gap-[8px]">
                <span className="w-[8px] h-[8px] rounded-full bg-[#008b45] animate-pulse"></span>
                <h2 className="font-manrope text-[17px] font-bold text-ink">
                  Active Withdrawal Request{pendingWithdrawals.length === 1 ? '' : 's'} ({pendingWithdrawals.length})
                </h2>
              </div>
              <p className="text-[13px] text-[#68736d] mt-[2px]">
                Your withdrawal request is being processed. Payouts are wired to your bank account within <strong>24 to 48 hours</strong> of your request.
              </p>
            </div>
            <span className="px-[12px] py-[5px] rounded-full bg-[#eef3ef] text-[#008b45] text-[11px] font-bold uppercase tracking-wider w-fit">
              24 to 48h Processing Window
            </span>
          </div>
          <div className="divide-y divide-black/5">
            {pendingWithdrawals.map(w => {
              const fee = w.fee ?? 0;
              const net = w.netAmount ?? (w.amount - fee);
              return (
                <div key={w.id} className="p-[20px] lg:p-[20px_30px] flex flex-col sm:flex-row sm:items-center justify-between gap-[15px]">
                  <div>
                    <div className="flex items-center gap-[8px] flex-wrap">
                      <strong className="text-[15px] text-ink font-manrope">
                        Bank Payout Request: {formatCurrency(w.amount)}
                      </strong>
                      <span className="px-[8px] py-[2px] rounded-full bg-[#fff8e1] text-[#d48806] text-[10px] font-bold uppercase tracking-wider">
                        Queued for Bank Wire
                      </span>
                    </div>
                    <div className="text-[12px] text-[#68736d] mt-[4px]">
                      Requested on {new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      {activeBank ? ` • Destination: ${activeBank.bankName} (${activeBank.accountNumber})` : ''}
                    </div>
                    <span className="text-[11px] text-[#7a847f] font-mono block mt-[2px]">
                      Ref: {w.reference || w.id.slice(0, 8)}
                    </span>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[11px] text-[#7a847f] uppercase font-bold block">Net Bank Payout</span>
                    <strong className="text-[18px] font-manrope font-bold text-[#008b45]">
                      {formatCurrency(net)}
                    </strong>
                    {fee > 0 && (
                      <span className="block text-[11px] text-[#68736d]">
                        (Fee: {formatCurrency(fee)})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
        <div className="p-[20px] lg:p-[30px] border-b border-black/5 bg-[#fcfdfc]">
          <h2 className="font-manrope text-[18px] lg:text-[20px] font-bold text-ink">Wallet History</h2>
        </div>
        
        <div className="divide-y divide-black/5">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-[#68736d] text-[14px]">No transactions yet.</div>
          ) : (
            transactions.map(tx => {
              const normType = tx.type.toLowerCase();
              let label = tx.type.replace(/_/g, ' ');
              let badge: string | null = null;
              let badgeClass = '';
              let isCredit = normType !== 'withdrawal' && normType !== 'investment';

              if (normType === 'commission_payout') {
                label = 'Sales Commission';
                badge = 'Agent Commission';
                badgeClass = 'bg-[#eef3ef] text-[#008b45]';
                isCredit = true;
              } else if (normType === 'roi' || normType === 'dividend') {
                label = normType === 'roi' ? 'Commodity Trade ROI' : 'Dividend Payout';
                badge = 'Trade Return';
                badgeClass = 'bg-[#008b45]/10 text-[#008b45]';
                isCredit = true;
              } else if (normType === 'principal_return') {
                label = 'Principal Capital Return';
                badge = 'Capital Return';
                badgeClass = 'bg-[#008b45]/10 text-[#008b45]';
                isCredit = true;
              } else if (normType === 'deposit') {
                label = 'Wallet Deposit';
                isCredit = true;
              } else if (normType === 'withdrawal') {
                label = 'Bank Withdrawal';
                isCredit = false;
              } else if (normType === 'investment') {
                label = 'Opportunity Allocation';
                badge = 'Investment';
                badgeClass = 'bg-black/5 text-[#555]';
                isCredit = false;
              } else if (normType === 'direct_bank_payout') {
                label = 'Direct Bank Payout';
                badge = 'Direct Bank';
                badgeClass = 'bg-[#008b45]/10 text-[#008b45]';
                isCredit = true;
              } else if (normType === 'offline_settlement_reconciliation') {
                label = 'Bank Settlement Adjustment';
                badge = 'Reconciliation';
                badgeClass = 'bg-amber-500/10 text-amber-700';
                isCredit = false;
              }

              return (
                <div key={tx.id} className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_120px] gap-[15px] p-[20px] lg:p-[20px_30px] items-center hover:bg-[#fcfdfc] transition-colors">
                  <div className="flex gap-[15px] items-center">
                    <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 ${
                      isCredit ? 'bg-[#eef3ef] text-[#008b45]' : 
                      tx.status === 'pending' ? 'bg-[#fff8e1] text-[#f5a623]' : 'bg-[#fdeeee] text-[#e53935]'
                    }`}>
                      {isCredit ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-[8px] flex-wrap">
                        <strong className="text-[14px] text-ink capitalize">{label} {tx.status === 'pending' ? '(Pending • 24-48h)' : ''}</strong>
                        {badge && (
                          <span className={`text-[10px] font-bold px-[8px] py-[2px] rounded-full uppercase tracking-wider ${badgeClass}`}>
                            {badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[12px] text-[#7a847f] font-mono block mt-[2px]">{tx.reference || tx.id.slice(0, 8)}</span>
                    </div>
                  </div>
                  
                  <div className="text-[13px] text-[#68736d]">
                    {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  
                  <div className="text-right">
                    <strong className={`block text-[16px] font-manrope ${isCredit ? 'text-[#008b45]' : 'text-ink'}`}>
                      {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                    </strong>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      tx.status === 'success' ? 'text-[#008b45]' : tx.status === 'pending' ? 'text-[#f5a623]' : 'text-[#e53935]'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Fund Modal */}
      {isFundModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl overflow-hidden">
            <div className="p-[20px] lg:p-[30px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
              <h2 className="font-manrope text-[18px] lg:text-[20px] font-bold text-ink">Fund Wallet</h2>
              <button onClick={() => setIsFundModalOpen(false)} className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center hover:bg-[#eef3ef] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <form className="p-[20px] lg:p-[30px] space-y-[20px]" action={handleFundSubmit}>
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
                    <button
                      type="button"
                      className="text-[12px] font-bold text-[#008b45] hover:underline"
                      onClick={() => {
                        navigator.clipboard.writeText('9133485636');
                        toast('Account number copied!', 'success');
                      }}
                    >
                      Copy
                    </button>
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
                <button 
                  type="submit" 
                  disabled={isSubmittingFund}
                  className="w-full py-[14px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.25)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmittingFund ? (
                    <>
                      <div className="w-[18px] h-[18px] border-[2px] border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting Receipt...
                    </>
                  ) : (
                    "Submit Receipt"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
            <div className="p-[20px] lg:p-[24px_30px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
              <div>
                <h2 className="font-manrope text-[18px] lg:text-[20px] font-bold text-ink">Withdraw Funds to Bank</h2>
                <p className="text-[12px] text-[#68736d]">Payouts are processed within 24 to 48 hours of your request.</p>
              </div>
              <button onClick={() => { setIsWithdrawModalOpen(false); setWithdrawAmount(''); }} className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center hover:bg-[#eef3ef] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <form className="p-[20px] lg:p-[30px] space-y-[20px]" action={handleWithdrawal}>
              {withdrawError && (
                <div className="p-3 bg-red-50 text-red-600 text-[13px] font-bold rounded-xl border border-red-100">
                  {withdrawError}
                </div>
              )}

              <div className="bg-[#eef3ef] border border-[#008b45]/20 rounded-[14px] p-[14px_16px] text-[12px] text-[#182a20] leading-relaxed">
                <strong>24 to 48 Hours Payout Schedule:</strong> Once you submit this withdrawal request, our finance team will transfer your funds directly to your verified bank account within <strong>24 to 48 hours</strong>.
              </div>

              <div className="bg-[#f7f9f7] rounded-[16px] p-[20px] border border-black/5">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#7a847f] mb-[15px]">Withdraw To</h3>
                {activeBank ? (
                  <div className="space-y-[10px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] text-[#68736d]">Bank</span>
                      <strong className="text-[14px] text-ink">{activeBank.bankName}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] text-[#68736d]">Account Name</span>
                      <strong className="text-[14px] text-ink">{activeBank.accountName}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] text-[#68736d]">Account Number</span>
                      <strong className="text-[16px] font-mono text-ink tracking-widest">{activeBank.accountNumber}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-3">
                    <p className="text-[13px] text-[#68736d]">You have no verified bank accounts on file.</p>
                    <Link href="/dashboard/settings" className="inline-block px-4 py-2 bg-white border border-black/10 rounded-full text-[13px] font-bold text-ink hover:bg-[#f7f9f7]">
                      Add Bank Account in Settings
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-[8px]">
                  <label className="block text-[13px] font-bold text-ink">Amount to Withdraw</label>
                  {balance > 0 && activeBank && (
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount(String(balance))}
                      className="text-[11px] font-bold text-[#008b45] hover:underline"
                    >
                      Withdraw Full Balance ({formatCurrency(balance)})
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-[15px] top-1/2 -translate-y-1/2 font-manrope font-bold text-[#68736d]">₦</span>
                  <input 
                    type="number" 
                    name="amount" 
                    placeholder="0.00" 
                    required 
                    max={balance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    disabled={!activeBank}
                    className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] pl-[35px] pr-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors font-manrope font-bold text-[16px] disabled:opacity-50" 
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[12px] text-[#68736d]">Available Balance:</span>
                  <strong className="text-[12px] text-[#008b45]">{formatCurrency(balance)}</strong>
                </div>
              </div>

              {Number(withdrawAmount) > 0 && (
                <div className="bg-[#f7f9f7] rounded-[16px] p-[16px] border border-black/5 space-y-[8px] text-[13px]">
                  <div className="flex justify-between items-center text-[#68736d]">
                    <span>Requested Gross:</span>
                    <span className="font-manrope font-medium text-ink">{formatCurrency(parseFloat(withdrawAmount) || 0)}</span>
                  </div>
                  {settlementFeePercent > 0 && (
                    <div className="flex justify-between items-center text-[#68736d]">
                      <span>Settlement Fee ({settlementFeePercent}%):</span>
                      <span className="font-manrope font-medium text-red-600">
                        -{formatCurrency(Math.round((((parseFloat(withdrawAmount) || 0) * settlementFeePercent) / 100) * 100) / 100)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-black/5 pt-[8px] flex justify-between items-center">
                    <strong className="text-ink">Net Bank Wire:</strong>
                    <strong className="font-manrope text-[16px] text-[#008b45]">
                      {formatCurrency(Math.max(0, (parseFloat(withdrawAmount) || 0) - (Math.round((((parseFloat(withdrawAmount) || 0) * settlementFeePercent) / 100) * 100) / 100)))}
                    </strong>
                  </div>
                  <p className="text-[11px] text-[#7a847f] pt-1 leading-relaxed">
                    Your Getlands wallet will be debited {formatCurrency(parseFloat(withdrawAmount) || 0)}. The net amount of {formatCurrency(Math.max(0, (parseFloat(withdrawAmount) || 0) - (Math.round((((parseFloat(withdrawAmount) || 0) * settlementFeePercent) / 100) * 100) / 100)))} will be transferred directly to your bank account within 24 to 48 hours.
                  </p>
                </div>
              )}

              <div className="pt-[10px]">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !activeBank || balance <= 0}
                  className="w-full py-[14px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.25)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-[18px] h-[18px] border-[2px] border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting Request...
                    </>
                  ) : (
                    "Submit Withdrawal Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
