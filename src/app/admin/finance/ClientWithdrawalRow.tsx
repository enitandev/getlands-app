"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { approveWithdrawalAction, rejectWithdrawalAction } from '@/app/actions/admin-ops';
import { formatCurrency as defaultFormatCurrency } from '@/lib/mockData';
import { getCustomerProfileUrl } from '@/lib/customerSlug';
import { toast } from '@/components/ui/Toast';

export default function ClientWithdrawalRow({
  withdrawal,
  formatCurrency = defaultFormatCurrency
}: {
  withdrawal: any;
  formatCurrency?: (val: number) => string;
}) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState<'approve' | 'reject' | null>(null);
  const [copiedAcc, setCopiedAcc] = useState(false);

  const user = withdrawal.user;
  const activeBank = user?.bankAccounts?.[0] || (user?.bankName && user?.accountNumber ? {
    bankName: user.bankName,
    accountNumber: user.accountNumber,
    accountName: user.accountName || `${user.firstName || ''} ${user.lastName || ''}`.trim()
  } : null);

  const fee = withdrawal.fee ?? 0;
  const netAmount = withdrawal.netAmount ?? (withdrawal.amount - fee);
  const isPending = withdrawal.status === 'pending';
  const isPaid = withdrawal.status === 'success';

  // Calculate hours elapsed since request for 24-48h SLA tracking
  const requestedAt = new Date(withdrawal.date);
  const hoursElapsed = Math.max(0, Math.floor((Date.now() - requestedAt.getTime()) / (1000 * 60 * 60)));
  const hoursRemaining = Math.max(0, 48 - hoursElapsed);

  const handleCopyAcc = (e: React.MouseEvent, accNum: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(accNum);
    setCopiedAcc(true);
    toast('Account number copied to clipboard', 'success');
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  const handleApprove = async () => {
    const bankDesc = activeBank
      ? `${activeBank.bankName} (${activeBank.accountNumber} • ${activeBank.accountName})`
      : 'Customer bank account';

    const refInput = window.prompt(
      `Confirm Bank Payout for ${user?.firstName || 'Customer'} ${user?.lastName || ''}\n\n` +
      `• Gross Requested: ${formatCurrency(withdrawal.amount)}\n` +
      `• Settlement Fee: ${formatCurrency(fee)}\n` +
      `• Net Wire to Bank: ${formatCurrency(netAmount)}\n` +
      `• Destination: ${bankDesc}\n\n` +
      `Optional: Enter bank transfer session ID or reference (or leave blank to confirm):`,
      ''
    );

    if (refInput === null) return; // Cancelled prompt

    setIsProcessing('approve');
    try {
      const res = await approveWithdrawalAction(withdrawal.id, refInput || undefined);
      if (!res.success) {
        toast(res.error || 'Failed to mark withdrawal as paid', 'error');
      } else {
        toast(`Withdrawal of ${formatCurrency(netAmount)} marked as paid and customer notified!`, 'success');
        router.refresh();
      }
    } catch (err: any) {
      toast(err.message || 'Failed to approve withdrawal', 'error');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt(
      `Reject withdrawal request of ${formatCurrency(withdrawal.amount)} for ${user?.firstName || 'Customer'}?\n\n` +
      `The full ${formatCurrency(withdrawal.amount)} will be automatically refunded back to their Getlands Wallet.\n\n` +
      `Enter a reason for the customer (optional):`,
      'Please verify your bank account details in Settings and try again.'
    );

    if (reason === null) return; // Cancelled prompt

    setIsProcessing('reject');
    try {
      const res = await rejectWithdrawalAction(withdrawal.id, reason || undefined);
      if (!res.success) {
        toast(res.error || 'Failed to reject withdrawal', 'error');
      } else {
        toast('Withdrawal request rejected and funds returned to customer wallet', 'info');
        router.refresh();
      }
    } catch (err: any) {
      toast(err.message || 'Failed to reject withdrawal', 'error');
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <tr className="text-[13px] hover:bg-[#fcfdfc] transition-colors">
      <td className="p-[15px_10px_15px_0] align-top">
        <div className="font-bold text-ink text-[13px]">
          {requestedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <div className="text-[11px] text-[#7a847f] font-mono">
          {requestedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
        {withdrawal.reference && (
          <div className="text-[10px] text-[#7a847f] font-mono mt-[2px] truncate max-w-[140px]" title={withdrawal.reference}>
            {withdrawal.reference}
          </div>
        )}
        {isPending && (
          <div className={`mt-[6px] inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full text-[10px] font-bold ${
            hoursElapsed >= 48
              ? 'bg-red-100 text-red-700'
              : hoursElapsed >= 24
                ? 'bg-amber-100 text-amber-800'
                : 'bg-[#eef3ef] text-[#008b45]'
          }`}>
            <span className={`w-[5px] h-[5px] rounded-full ${
              hoursElapsed >= 48 ? 'bg-red-600 animate-ping' : hoursElapsed >= 24 ? 'bg-amber-600' : 'bg-[#008b45]'
            }`} />
            {hoursElapsed >= 48
              ? `${hoursElapsed}h ago (Over 48h SLA)`
              : `${hoursElapsed}h ago (${hoursRemaining}h left in 48h SLA)`}
          </div>
        )}
      </td>

      <td className="p-[15px_10px] align-top">
        {user ? (
          <Link
            href={getCustomerProfileUrl(user)}
            className="font-bold text-[14px] text-ink hover:text-[#008b45] hover:underline block"
          >
            {user.firstName} {user.lastName}
          </Link>
        ) : (
          <strong className="block text-[14px] text-ink">Customer</strong>
        )}
        <span className="text-[12px] text-[#68736d] block">{user?.email || 'N/A'}</span>
        {user?.phoneNumber && (
          <span className="text-[11px] text-[#7a847f] block">{user.phoneNumber}</span>
        )}
        {typeof user?.walletBalance === 'number' && (
          <span className="inline-block mt-[4px] text-[11px] text-[#68736d] bg-[#f4f7f5] px-[8px] py-[2px] rounded-md">
            Remaining Wallet: <strong className="text-ink">{formatCurrency(user.walletBalance)}</strong>
          </span>
        )}
      </td>

      <td className="p-[15px_10px] align-top">
        {activeBank ? (
          <div className="bg-[#f7f9f7] border border-black/5 rounded-[10px] p-[10px] max-w-[240px]">
            <strong className="block text-[13px] text-ink">{activeBank.bankName}</strong>
            <div className="flex items-center gap-[6px] mt-[2px]">
              <span className="text-[13px] text-[#008b45] font-mono font-bold tracking-wider">
                {activeBank.accountNumber}
              </span>
              <button
                type="button"
                onClick={(e) => handleCopyAcc(e, activeBank.accountNumber)}
                className="text-[10px] px-[6px] py-[2px] rounded bg-white border border-black/10 hover:border-[#008b45] text-ink font-sans font-bold transition-colors"
                title="Copy account number"
              >
                {copiedAcc ? 'Copied' : 'Copy'}
              </button>
            </div>
            {activeBank.accountName && (
              <span className="block text-[11px] text-[#68736d] mt-[2px] uppercase truncate" title={activeBank.accountName}>
                {activeBank.accountName}
              </span>
            )}
          </div>
        ) : (
          <div className="text-[12px] text-red-600 font-bold bg-red-50 border border-red-100 px-[10px] py-[8px] rounded-[10px] inline-block">
            No Bank Details Saved
            {user && (
              <Link
                href={getCustomerProfileUrl(user)}
                className="block text-[11px] text-ink underline mt-[2px] font-normal"
              >
                Add bank on profile &rarr;
              </Link>
            )}
          </div>
        )}
      </td>

      <td className="p-[15px_10px] align-top">
        <span className="text-[14px] text-ink font-bold font-manrope block">{formatCurrency(withdrawal.amount)}</span>
        <span className="text-[10px] text-[#7a847f] uppercase font-bold">Wallet Debited</span>
      </td>

      <td className="p-[15px_10px] align-top">
        <span className={`text-[13px] font-manrope ${fee > 0 ? 'text-red-600 font-bold' : 'text-[#68736d]'}`}>
          {fee > 0 ? `-${formatCurrency(fee)}` : '₦0'}
        </span>
      </td>

      <td className="p-[15px_10px] align-top">
        <strong className="text-[16px] text-[#008b45] font-extrabold font-manrope block">
          {formatCurrency(netAmount)}
        </strong>
        <span className="text-[10px] text-[#008b45] uppercase font-bold tracking-wider">Net Wire to Bank</span>
      </td>

      <td className="p-[15px_0_15px_10px] text-right align-top">
        {isPending ? (
          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-[8px]">
            <button
              type="button"
              onClick={handleApprove}
              disabled={isProcessing !== null}
              className="bg-[#008b45] text-white px-[14px] py-[8px] rounded-full text-[11px] font-bold hover:bg-[#007339] disabled:opacity-50 transition-colors shadow-sm whitespace-nowrap"
            >
              {isProcessing === 'approve' ? 'Saving...' : 'Mark as Paid'}
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={isProcessing !== null}
              className="bg-[#fdeeee] text-[#e53935] hover:bg-[#fbdada] px-[12px] py-[8px] rounded-full text-[11px] font-bold disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {isProcessing === 'reject' ? 'Refunding...' : 'Reject & Refund'}
            </button>
          </div>
        ) : isPaid ? (
          <span className="inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-full bg-[#eef3ef] text-[#008b45] text-[10px] font-bold uppercase tracking-wider">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Paid to Bank
          </span>
        ) : (
          <span className="inline-flex items-center gap-[5px] px-[10px] py-[4px] rounded-full bg-[#fdeeee] text-[#e53935] text-[10px] font-bold uppercase tracking-wider">
            Rejected &amp; Refunded
          </span>
        )}
      </td>
    </tr>
  );
}
