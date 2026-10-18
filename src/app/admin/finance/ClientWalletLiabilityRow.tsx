"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { reconcileWalletBalanceAction } from '@/app/actions/accounting';
import { toast } from '@/components/ui/Toast';

interface ClientWalletLiabilityRowProps {
  user: any;
  formatCurrency: (val: number) => string;
}

export default function ClientWalletLiabilityRow({ user, formatCurrency }: ClientWalletLiabilityRowProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deductAmount, setDeductAmount] = useState<number>(user.walletBalance);
  const [reason, setReason] = useState('Settled directly via corporate bank transfer');
  const [sendEmail, setSendEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeBank = user.bankAccounts?.[0];
  const bankName = activeBank?.bankName || user.bankName;
  const accountNumber = activeBank?.accountNumber || user.accountNumber;
  const accountName = activeBank?.accountName || user.accountName || `${user.firstName} ${user.lastName}`.trim();

  const handleReconcile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deductAmount <= 0 || deductAmount > user.walletBalance) {
      return toast(`Deduction must be between ₦1 and ${formatCurrency(user.walletBalance)}`, 'error');
    }

    setIsSubmitting(true);
    const res = await reconcileWalletBalanceAction(user.id, deductAmount, reason, sendEmail);
    setIsSubmitting(false);

    if (res?.error) {
      toast(res.error, 'error');
    } else {
      toast(`Successfully deducted ${formatCurrency(deductAmount)} and cleared liability!`, 'success');
      setIsModalOpen(false);
      router.refresh();
    }
  };

  return (
    <>
      <tr className="text-[13px] hover:bg-gray-50/50 transition-colors">
        <td className="p-[14px_0]">
          <strong className="block text-[14px] text-ink">{user.firstName} {user.lastName}</strong>
          <span className="text-[12px] text-[#68736d]">{user.email}</span>
        </td>
        <td className="p-[14px]">
          <strong className="text-[16px] font-manrope font-bold text-red-600 block">
            {formatCurrency(user.walletBalance)}
          </strong>
          <span className="text-[11px] text-[#7a847f]">Active Liability</span>
        </td>
        <td className="p-[14px]">
          {bankName && accountNumber ? (
            <div>
              <strong className="block text-[13px] text-ink">{bankName}</strong>
              <span className="text-[12px] text-[#68736d] font-mono">{accountNumber} • {accountName}</span>
            </div>
          ) : (
            <span className="text-[12px] text-amber-700 bg-amber-50 px-[8px] py-[3px] rounded-full font-medium">
              No Saved Bank Account
            </span>
          )}
        </td>
        <td className="p-[14px]">
          {user.payouts && user.payouts.length > 0 ? (
            <div className="space-y-[4px]">
              {user.payouts.slice(0, 2).map((p: any) => (
                <div key={p.id} className="text-[12px] text-[#4a554f]">
                  <span className="font-semibold">{formatCurrency(p.amount)}</span> ({p.holding?.opportunity?.title || 'Investment'})
                  <span className="text-[10px] text-[#7a847f] ml-1">
                    • {new Date(p.paidAt || p.dueDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-[12px] text-[#7a847f]">Direct wallet deposit / credit</span>
          )}
        </td>
        <td className="p-[14px] text-right">
          <button
            type="button"
            onClick={() => {
              setDeductAmount(user.walletBalance);
              setIsModalOpen(true);
            }}
            className="px-[14px] py-[7px] bg-[#182a20] text-white hover:bg-black text-[12px] font-bold rounded-full transition-colors shadow-sm whitespace-nowrap"
          >
            Clear Settled Payout
          </button>
        </td>
      </tr>

      {/* Reconciliation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in text-left">
          <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl overflow-hidden">
            <div className="p-[20px] lg:p-[25px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
              <div>
                <h3 className="font-manrope text-[18px] font-bold text-ink">Reconcile Wallet Liability</h3>
                <p className="text-[12px] text-[#68736d]">Deduct balance for payments already settled directly via bank transfer.</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)} 
                className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center hover:bg-[#eef3ef] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <form onSubmit={handleReconcile} className="p-[20px] lg:p-[25px] space-y-[20px]">
              {/* Customer Balance Banner */}
              <div className="bg-[#f7f9f7] p-[16px] rounded-[16px] border border-black/5 flex justify-between items-center">
                <div>
                  <span className="text-[11px] text-[#7a847f] uppercase font-bold tracking-wider block">Customer</span>
                  <strong className="text-[14px] text-ink">{user.firstName} {user.lastName}</strong>
                  <span className="text-[12px] text-[#68736d] block">{user.email}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#7a847f] uppercase font-bold tracking-wider block">Current Balance</span>
                  <strong className="text-[20px] font-manrope font-bold text-red-600">{formatCurrency(user.walletBalance)}</strong>
                </div>
              </div>

              {/* Amount to Deduct */}
              <div>
                <label className="block text-[12px] font-bold text-ink mb-[6px]">
                  Amount to Deduct from Wallet (₦)
                </label>
                <input 
                  type="number" 
                  step="any"
                  max={user.walletBalance}
                  min={1}
                  value={deductAmount} 
                  onChange={(e) => setDeductAmount(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full h-[48px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors text-[16px] font-bold font-manrope"
                />
                <div className="flex justify-between items-center mt-[6px]">
                  <span className="text-[11px] text-[#7a847f]">Remaining Balance after deduction:</span>
                  <strong className="text-[12px] font-manrope text-ink">{formatCurrency(Math.max(0, user.walletBalance - deductAmount))}</strong>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-[12px] font-bold text-ink mb-[6px]">
                  Settlement Reason / Reconciliation Note
                </label>
                <input 
                  type="text" 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full h-[46px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors text-[13px]"
                />
              </div>

              {/* Optional Email Notification */}
              <label className="flex items-center gap-[10px] cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={sendEmail} 
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="w-[16px] h-[16px] rounded border-black/20 text-[#008b45] focus:ring-[#008b45]"
                />
                <span className="text-[12px] text-[#4a554f]">
                  Send customer an email notification explaining the settlement adjustment
                </span>
              </label>

              <div className="bg-amber-50 p-[12px_15px] rounded-[12px] border border-amber-200 text-[12px] text-amber-900 leading-relaxed">
                <strong>Warning:</strong> This will deduct {formatCurrency(deductAmount)} immediately from {user.firstName}'s wallet balance, safely discharging the platform liability and preventing duplicate withdrawals.
              </div>

              <div className="pt-[5px] flex gap-[10px]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-[12px] bg-white border border-black/10 text-ink font-bold rounded-full hover:bg-[#f7f9f7] text-[13px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-[12px] bg-red-600 text-white font-bold rounded-full hover:bg-red-700 text-[13px] transition-colors disabled:opacity-50 shadow-[0_4px_12px_rgba(229,57,53,0.25)]"
                >
                  {isSubmitting ? 'Deducting...' : 'Confirm & Clear Liability'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
