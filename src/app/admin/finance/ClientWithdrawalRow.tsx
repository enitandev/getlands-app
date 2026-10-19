"use client";
import React, { useState } from 'react';
import { approveWithdrawalAction } from '@/app/actions/admin-ops';

export default function ClientWithdrawalRow({ withdrawal, formatCurrency }: { withdrawal: any, formatCurrency: (val: number) => string }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const activeBank = withdrawal.user.bankAccounts?.[0];

  const fee = withdrawal.fee ?? 0;
  const netAmount = withdrawal.netAmount ?? (withdrawal.amount - fee);

  const handleCopyAcc = (e: React.MouseEvent, accNum: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(accNum);
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  const handleApprove = async () => {
    const confirmMsg = `Are you sure you have wired ${formatCurrency(netAmount)} to ${withdrawal.user?.firstName || 'this user'}'s bank account?\n\n` +
      `• Requested: ${formatCurrency(withdrawal.amount)}\n` +
      `• Settlement Fee: ${formatCurrency(fee)}\n` +
      `• Net Wired to Bank: ${formatCurrency(netAmount)}\n\n` +
      `This will mark the withdrawal as complete and send the customer a confirmation email.`;

    if (!confirm(confirmMsg)) return;
    
    setIsProcessing(true);
    const res = await approveWithdrawalAction(withdrawal.id);
    if (!res.success) {
      alert(res.error || "Failed to approve withdrawal");
      setIsProcessing(false);
    }
  };

  return (
    <tr className="text-[13px] hover:bg-[#fcfdfc] transition-colors">
      <td className="p-[15px_0] text-[#68736d] font-mono text-[12px]">
        {new Date(withdrawal.date).toLocaleDateString()}
      </td>
      <td className="p-[15px]">
        <strong className="block text-[14px] text-ink">{withdrawal.user?.firstName || 'User'} {withdrawal.user?.lastName || ''}</strong>
        <span className="text-[12px] text-[#68736d]">{withdrawal.user?.email || 'N/A'}</span>
      </td>
      <td className="p-[15px]">
        {activeBank ? (
          <div>
            <strong className="block text-[13px] text-ink">{activeBank.bankName}</strong>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[12px] text-[#68736d] font-mono font-bold tracking-wider">{activeBank.accountNumber}</span>
              <button 
                onClick={(e) => handleCopyAcc(e, activeBank.accountNumber)}
                className="text-[10px] px-1.5 py-0.5 rounded bg-black/5 hover:bg-black/10 text-[#68736d] font-sans font-bold transition-colors"
                title="Copy account number"
              >
                {copiedAcc ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        ) : (
          <span className="text-[12px] text-red-500 font-bold">No Bank Details</span>
        )}
      </td>
      <td className="p-[15px]">
        <span className="text-[13px] text-[#68736d] font-manrope">{formatCurrency(withdrawal.amount)}</span>
      </td>
      <td className="p-[15px]">
        <span className={`text-[12px] font-manrope ${fee > 0 ? 'text-red-600 font-bold' : 'text-[#68736d]'}`}>
          {fee > 0 ? `-${formatCurrency(fee)}` : '₦0'}
        </span>
      </td>
      <td className="p-[15px]">
        <strong className="text-[15px] text-[#008b45] font-bold font-manrope block">{formatCurrency(netAmount)}</strong>
        <span className="text-[10px] text-[#7a847f] uppercase font-bold tracking-wider">Wire to Bank</span>
      </td>
      <td className="p-[15px] text-right">
        <button 
          onClick={handleApprove}
          disabled={isProcessing || !activeBank}
          className="bg-[#008b45] text-white px-[15px] py-[7px] rounded-full text-[11px] font-bold hover:bg-[#007339] disabled:opacity-50 transition-colors shadow-sm"
        >
          {isProcessing ? 'Processing...' : 'Mark as Paid'}
        </button>
      </td>
    </tr>
  );
}
