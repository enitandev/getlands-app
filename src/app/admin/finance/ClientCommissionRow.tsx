"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  executeCommissionWalletPayoutAction,
  executeCommissionBankPayoutAction,
  voidCommissionAction
} from '@/app/actions/accounting';
import { formatCurrency as defaultFormatCurrency } from '@/lib/mockData';
import { getCustomerProfileUrl } from '@/lib/customerSlug';
import { toast } from '@/components/ui/Toast';

export default function ClientCommissionRow({
  commission,
  formatCurrency = defaultFormatCurrency
}: {
  commission: any;
  formatCurrency?: (v: number) => string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState<string>(commission.status);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [bankRef, setBankRef] = useState('');
  const [copied, setCopied] = useState(false);

  const agent = commission.agent;
  const activeBank = agent?.bankAccounts?.[0];
  const bankName = activeBank?.bankName || agent?.bankName;
  const accountNumber = activeBank?.accountNumber || agent?.accountNumber;
  const accountName =
    activeBank?.accountName ||
    agent?.accountName ||
    `${agent?.firstName || ''} ${agent?.lastName || ''}`.trim();

  const clientName = commission.holding?.user
    ? `${commission.holding.user.firstName || ''} ${commission.holding.user.lastName || ''}`.trim()
    : null;
  const opportunityTitle = commission.holding?.opportunity?.title || 'Investment Holding';
  const holdingRef = commission.holding?.referenceCode;
  const holdingAmount = commission.holding?.totalAmount;

  const createdDate = new Date(commission.createdAt);
  const ageMs = Date.now() - createdDate.getTime();
  const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
  const daysLeftInEscrow = Math.max(0, 7 - ageDays);
  const isMatured = ageDays >= 7;

  const handleCreditWallet = async () => {
    if (
      !confirm(
        `Credit ${formatCurrency(commission.amount)} commission directly to ${agent?.firstName || 'this agent'}'s Getlands digital wallet?\n\nThe agent will immediately receive an in-app notification and email.`
      )
    )
      return;

    setLoading(true);
    const res = await executeCommissionWalletPayoutAction(commission.id);
    setLoading(false);

    if (res?.error) {
      toast(res.error, 'error');
    } else {
      setLocalStatus('PAID');
      toast('Commission credited to agent wallet and notification sent!', 'success');
      router.refresh();
    }
  };

  const handleDirectBankPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await executeCommissionBankPayoutAction(commission.id, bankRef);
    setLoading(false);

    if (res?.error) {
      toast(res.error, 'error');
    } else {
      setLocalStatus('PAID');
      toast('Commission marked as paid to bank and agent notified!', 'success');
      setIsBankModalOpen(false);
      router.refresh();
    }
  };

  const handleVoid = async () => {
    const reason = prompt(
      `Cancel this ${formatCurrency(commission.amount)} commission for ${agent?.firstName || 'agent'}?\n\nOptional reason (leave blank for default):`
    );
    if (reason === null) return;

    setLoading(true);
    const res = await voidCommissionAction(commission.id, reason.trim() || undefined);
    setLoading(false);

    if (res?.error) {
      toast(res.error, 'error');
    } else {
      setLocalStatus('VOID');
      toast('Commission cancelled', 'info');
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

  return (
    <>
      <tr className="text-[13px] hover:bg-gray-50/50 transition-colors">
        <td className="p-[12px_0]">
          <div className="font-bold text-ink">{createdDate.toLocaleDateString()}</div>
          {localStatus === 'PENDING' && (
            <div className="mt-[4px]">
              {isMatured ? (
                <span className="inline-flex items-center gap-[4px] bg-[#eef3ef] text-[#008b45] text-[9px] font-bold px-[6px] py-[2px] rounded-full uppercase">
                  Ready to Pay
                </span>
              ) : (
                <span className="inline-flex items-center gap-[4px] bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold px-[6px] py-[2px] rounded-full uppercase">
                  Escrow ({daysLeftInEscrow}d left)
                </span>
              )}
            </div>
          )}
        </td>

        <td className="p-[12px]">
          {agent ? (
            <Link
              href={getCustomerProfileUrl(agent)}
              className="font-bold text-ink hover:text-[#008b45] hover:underline block"
            >
              {agent.firstName} {agent.lastName}
            </Link>
          ) : (
            <div className="font-bold text-ink">
              {agent?.firstName || 'Sales'} {agent?.lastName || 'Agent'}
            </div>
          )}
          <div className="text-[11px] text-[#68736d]">
            {agent?.email || 'N/A'}
            {agent?.phoneNumber ? ` • ${agent.phoneNumber}` : ''}
          </div>
          {bankName && accountNumber ? (
            <div className="text-[11px] text-[#008b45] font-mono font-bold mt-[2px]">
              {bankName} • {accountNumber}
            </div>
          ) : (
            <div className="text-[10px] text-amber-600 font-bold mt-[2px]">
              No bank account on file
            </div>
          )}
        </td>

        <td className="p-[12px]">
          <div className="font-bold text-[#182a20]">
            {clientName ? `Client: ${clientName}` : opportunityTitle}
          </div>
          <div className="text-[12px] text-[#4a554f]">
            {opportunityTitle}
            {holdingAmount ? ` (${formatCurrency(holdingAmount)})` : ''}
          </div>
          <div className="flex items-center gap-[6px] mt-[3px]">
            <span className="bg-black/5 text-ink text-[10px] font-bold px-[6px] py-[1px] rounded">
              Tier {commission.tierLevel || 1} {commission.tierLevel === 2 ? 'Sub-Agent' : 'Direct'}
            </span>
            {holdingRef && (
              <span className="text-[11px] text-[#68736d] font-mono">{holdingRef}</span>
            )}
          </div>
        </td>

        <td className="p-[12px] font-bold text-[#008b45] text-[15px] font-manrope">
          {formatCurrency(commission.amount)}
        </td>

        <td className="p-[12px] text-right">
          {localStatus === 'PENDING' ? (
            <div className="flex items-center justify-end gap-[8px] flex-wrap">
              <button
                type="button"
                onClick={() => setIsBankModalOpen(true)}
                disabled={loading}
                className="px-[12px] py-[6px] bg-[#008b45] text-white text-[11px] font-bold rounded-full hover:bg-[#007339] disabled:opacity-50 transition-colors whitespace-nowrap shadow-sm"
                title="Pay agent directly to their bank account and mark as paid"
              >
                Pay Direct to Bank
              </button>
              <button
                type="button"
                onClick={handleCreditWallet}
                disabled={loading}
                className="px-[10px] py-[6px] bg-white border border-black/10 hover:border-[#008b45] text-ink hover:text-[#008b45] text-[11px] font-bold rounded-full disabled:opacity-50 transition-colors whitespace-nowrap"
                title="Release commission into agent's Getlands digital wallet"
              >
                Credit to Wallet
              </button>
              <button
                type="button"
                onClick={handleVoid}
                disabled={loading}
                className="px-[8px] py-[6px] text-[#e53935] hover:bg-[#fdeeee] text-[11px] font-bold rounded-full disabled:opacity-50 transition-colors whitespace-nowrap"
                title="Cancel/void this commission"
              >
                Void
              </button>
            </div>
          ) : (
            <span
              className={`inline-flex px-[10px] py-[4px] rounded-full text-[10px] font-bold uppercase tracking-wider ${
                localStatus === 'PAID'
                  ? 'bg-[#eef3ef] text-[#008b45]'
                  : 'bg-[#fdeeee] text-[#e53935]'
              }`}
            >
              {localStatus}
            </span>
          )}
        </td>
      </tr>

      {/* Direct Bank Commission Payout Modal */}
      {isBankModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in text-left">
          <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl overflow-hidden">
            <div className="p-[20px] lg:p-[25px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
              <div>
                <h3 className="font-manrope text-[18px] font-bold text-ink">
                  Pay Agent Commission to Bank
                </h3>
                <p className="text-[12px] text-[#68736d]">
                  Transfer commission to the sales agent and mark as paid.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBankModalOpen(false)}
                className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center hover:bg-[#eef3ef] transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleDirectBankPayout} className="p-[20px] lg:p-[25px] space-y-[20px]">
              {/* Payment Summary */}
              <div className="bg-[#182a20] text-white p-[20px] rounded-[16px] flex justify-between items-center gap-[12px]">
                <div>
                  <span className="text-[11px] text-[#a6baa9] uppercase tracking-wider font-bold block mb-[2px]">
                    Commission Due
                  </span>
                  <strong className="text-[24px] font-manrope font-bold text-white leading-none">
                    {formatCurrency(commission.amount)}
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#a6baa9] uppercase tracking-wider font-bold block mb-[2px]">
                    Sales Agent
                  </span>
                  <span className="text-[13px] font-bold text-white block">
                    {agent?.firstName} {agent?.lastName}
                  </span>
                  {clientName && (
                    <span className="text-[11px] text-[#a6baa9] block">
                      Client: {clientName}
                    </span>
                  )}
                </div>
              </div>

              {/* Verified Bank Details */}
              <div className="bg-[#f7f9f7] rounded-[16px] p-[20px] border border-black/5 space-y-[12px]">
                <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#7a847f] block">
                  Agent Bank Account
                </span>
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
                        <strong className="text-[18px] font-mono tracking-widest text-ink">
                          {accountNumber}
                        </strong>
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
                    This sales agent has not added a bank account to their profile yet. You can obtain their account number via WhatsApp or credit their Getlands wallet instead.
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
                  onChange={e => setBankRef(e.target.value)}
                  placeholder="e.g. MONIEPOINT-89412"
                  className="w-full h-[46px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors text-[14px]"
                />
              </div>

              <div className="bg-[#eef3ef] p-[12px_15px] rounded-[12px] border border-[#008b45]/20 text-[12px] text-[#008b45] leading-relaxed">
                <strong>Note:</strong> Confirming this marks the commission as <strong>PAID</strong>, logs the direct bank payout, and sends both an in-app notification and email alert to {agent?.firstName || 'the agent'}.
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
