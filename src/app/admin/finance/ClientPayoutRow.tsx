"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { executePayoutAction, executeDirectBankPayoutAction } from '@/app/actions/accounting';
import { formatCurrency as defaultFormatCurrency } from '@/lib/mockData';
import { getCustomerProfileUrl } from '@/lib/customerSlug';
import { toast } from '@/components/ui/Toast';

export default function ClientPayoutRow({
  payout,
  formatCurrency = defaultFormatCurrency
}: {
  payout: any;
  formatCurrency?: (v: number) => string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState<string>(payout.status || 'PENDING');
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [bankRef, setBankRef] = useState('');
  const [copied, setCopied] = useState(false);

  const activeBank = payout.user?.bankAccounts?.[0];
  const bankName = activeBank?.bankName || payout.user?.bankName;
  const accountNumber = activeBank?.accountNumber || payout.user?.accountNumber;
  const accountName = activeBank?.accountName || payout.user?.accountName || `${payout.user?.firstName || ''} ${payout.user?.lastName || ''}`.trim();

  const handleCreditWallet = async () => {
    if (!confirm(`Credit ${formatCurrency(payout.amount)} directly to ${payout.user?.firstName || 'this user'}'s Getlands digital wallet?\n\nNote: The customer will receive a wallet credit notification and email.`)) return;

    setLoading(true);
    const res = await executePayoutAction(payout.id);
    setLoading(false);

    if (res?.error) {
      toast(res.error, 'error');
    } else {
      setLocalStatus('PAID');
      toast('Payout credited to customer wallet and notification sent!', 'success');
      router.refresh();
    }
  };

  const handleDirectBankPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await executeDirectBankPayoutAction(payout.id, bankRef);
    setLoading(false);

    if (res?.error) {
      toast(res.error, 'error');
    } else {
      setLocalStatus('PAID');
      toast('Payout marked as sent directly to bank and customer notified!', 'success');
      setIsBankModalOpen(false);
      router.refresh();
    }
  };

  const handleCopyAccount = () => {
    if (!accountNumber) return;
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast('Account number copied to clipboard', 'success');
  };

  const isOverdue = localStatus === 'PENDING' && new Date(payout.dueDate) < new Date();

  return (
    <>
      <tr className="text-[13px] hover:bg-gray-50/50 transition-colors">
        <td className="p-[12px_0]">
          <div className="flex items-center gap-[8px]">
            <span className={`font-bold ${isOverdue ? 'text-red-500' : 'text-ink'}`}>
              {new Date(payout.dueDate).toLocaleDateString()}
            </span>
            {isOverdue && <span className="bg-red-100 text-red-600 text-[9px] font-bold px-[6px] py-[2px] rounded-full uppercase">Overdue</span>}
          </div>
          {localStatus === 'PAID' && payout.paidAt && (
            <div className="text-[10px] text-[#008b45] font-medium mt-[2px]">
              Paid {new Date(payout.paidAt).toLocaleDateString()}
            </div>
          )}
        </td>
        <td className="p-[12px]">
          {payout.user ? (
            <Link href={getCustomerProfileUrl(payout.user)} className="font-bold text-ink hover:text-[#008b45] hover:underline block">
              {payout.user?.firstName || 'User'} {payout.user?.lastName || ''}
            </Link>
          ) : (
            <div className="font-bold text-ink">{payout.user?.firstName || 'User'} {payout.user?.lastName || ''}</div>
          )}
          <div className="text-[11px] text-[#68736d]">{payout.user?.email || 'N/A'}</div>
          {bankName && accountNumber ? (
            <div className="text-[11px] text-[#008b45] font-mono font-bold mt-[2px]">
              {bankName} • {accountNumber}
            </div>
          ) : (
            <div className="text-[10px] text-amber-600 font-bold mt-[2px]">
              No bank on file
            </div>
          )}
        </td>
        <td className="p-[12px]">
          <div className="text-[#4a554f] font-medium">{payout.holding?.opportunity?.title || 'General Investment'}</div>
          <div className="text-[11px] text-[#68736d] font-mono">{payout.type}</div>
        </td>
        <td className="p-[12px] font-bold text-[#008b45] text-[15px] font-manrope">
          {formatCurrency(payout.amount)}
        </td>
        <td className="p-[12px] text-right">
          {localStatus === 'PENDING' ? (
            <div className="flex items-center justify-end gap-[8px]">
              <button 
                type="button"
                onClick={() => setIsBankModalOpen(true)}
                disabled={loading}
                className="px-[12px] py-[6px] bg-[#008b45] text-white text-[11px] font-bold rounded-full hover:bg-[#007339] disabled:opacity-50 transition-colors whitespace-nowrap shadow-sm"
                title="Record that you sent payment directly from your bank account"
              >
                Pay Direct to Bank
              </button>
              <button 
                type="button"
                onClick={handleCreditWallet} 
                disabled={loading}
                className="px-[10px] py-[6px] bg-white border border-black/10 hover:border-[#008b45] text-ink hover:text-[#008b45] text-[11px] font-bold rounded-full disabled:opacity-50 transition-colors whitespace-nowrap"
                title="Deposit funds into customer's Getlands digital wallet"
              >
                Credit to Wallet
              </button>
            </div>
          ) : (
            <span className="inline-flex px-[10px] py-[4px] rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#eef3ef] text-[#008b45]">
              {localStatus}
            </span>
          )}
        </td>
      </tr>

      {/* Direct Bank Settlement Modal */}
      {isBankModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in text-left">
          <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl overflow-hidden">
            <div className="p-[20px] lg:p-[25px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
              <div>
                <h3 className="font-manrope text-[18px] font-bold text-ink">Direct Bank Payout</h3>
                <p className="text-[12px] text-[#68736d]">Wire payment from corporate bank and record settlement.</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsBankModalOpen(false)} 
                className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center hover:bg-[#eef3ef] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <form onSubmit={handleDirectBankPayout} className="p-[20px] lg:p-[25px] space-y-[20px]">
              {/* Payment Summary */}
              <div className="bg-[#182a20] text-white p-[20px] rounded-[16px] flex justify-between items-center">
                <div>
                  <span className="text-[11px] text-[#a6baa9] uppercase tracking-wider font-bold block mb-[2px]">Amount to Pay</span>
                  <strong className="text-[24px] font-manrope font-bold text-white leading-none">{formatCurrency(payout.amount)}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#a6baa9] uppercase tracking-wider font-bold block mb-[2px]">Investment</span>
                  <span className="text-[13px] font-bold text-white">{payout.holding?.opportunity?.title || 'Investment'}</span>
                </div>
              </div>

              {/* Verified Bank Details */}
              <div className="bg-[#f7f9f7] rounded-[16px] p-[20px] border border-black/5 space-y-[12px]">
                <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#7a847f] block">Recipient Bank Account</span>
                {bankName && accountNumber ? (
                  <div className="space-y-[8px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] text-[#68736d]">Bank Name</span>
                      <strong className="text-[14px] text-ink">{bankName}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] text-[#68736d]">Account Name</span>
                      <strong className="text-[14px] text-ink">{accountName}</strong>
                    </div>
                    <div className="flex justify-between items-center bg-white p-[10px_12px] rounded-[10px] border border-black/5 mt-[6px]">
                      <div>
                        <span className="text-[11px] text-[#7a847f] block">Account Number</span>
                        <strong className="text-[18px] font-mono tracking-widest text-ink">{accountNumber}</strong>
                      </div>
                      <button 
                        type="button" 
                        onClick={handleCopyAccount}
                        className="px-[12px] py-[6px] bg-[#eef3ef] hover:bg-[#008b45] text-[#008b45] hover:text-white rounded-full text-[11px] font-bold transition-colors"
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 text-amber-800 text-[12px] rounded-[10px] border border-amber-200">
                    No verified bank account saved on profile. Please obtain bank details directly from the customer.
                  </div>
                )}
              </div>

              {/* Bank Reference */}
              <div>
                <label className="block text-[12px] font-bold text-ink mb-[6px]">
                  Bank Transfer Reference / Notes (Optional)
                </label>
                <input 
                  type="text" 
                  value={bankRef} 
                  onChange={(e) => setBankRef(e.target.value)}
                  placeholder="e.g. TRF-912049 or Bank Ref" 
                  className="w-full h-[46px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors text-[14px]"
                />
              </div>

              <div className="bg-[#eef3ef] p-[12px_15px] rounded-[12px] border border-[#008b45]/20 text-[12px] text-[#008b45] leading-relaxed">
                <strong>Important:</strong> This confirms you have transferred the funds from your corporate bank. The payout will be marked as settled directly to bank and will <strong>not</strong> touch the customer's wallet balance.
              </div>

              <div className="pt-[5px] flex gap-[10px]">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="flex-1 py-[12px] bg-white border border-black/10 text-ink font-bold rounded-full hover:bg-[#f7f9f7] text-[13px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-[12px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] text-[13px] transition-colors disabled:opacity-50 shadow-[0_4px_12px_rgba(0,139,69,0.2)]"
                >
                  {loading ? 'Confirming...' : 'Confirm Bank Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
