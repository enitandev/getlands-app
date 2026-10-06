"use client";
import React, { useState } from 'react';
import { approveWithdrawalAction } from '@/app/actions/admin-ops';

export default function ClientWithdrawalRow({ withdrawal, formatCurrency }: { withdrawal: any, formatCurrency: (val: number) => string }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const activeBank = withdrawal.user.bankAccounts?.[0];

  const handleApprove = async () => {
    if (!confirm(`Are you sure you have already wired ${formatCurrency(withdrawal.amount)} to ${withdrawal.user.firstName}'s bank account? This will mark it as paid and send them a confirmation email.`)) return;
    
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
        <strong className="block text-[14px] text-ink">{withdrawal.user.firstName} {withdrawal.user.lastName}</strong>
        <span className="text-[12px] text-[#68736d]">{withdrawal.user.email}</span>
      </td>
      <td className="p-[15px]">
        {activeBank ? (
          <div>
            <strong className="block text-[13px] text-ink">{activeBank.bankName}</strong>
            <span className="text-[12px] text-[#68736d] font-mono">{activeBank.accountNumber}</span>
          </div>
        ) : (
          <span className="text-[12px] text-red-500 font-bold">No Bank Details</span>
        )}
      </td>
      <td className="p-[15px]">
        <strong className="text-[15px] text-ink font-manrope">{formatCurrency(withdrawal.amount)}</strong>
      </td>
      <td className="p-[15px] text-right">
        <button 
          onClick={handleApprove}
          disabled={isProcessing || !activeBank}
          className="bg-[#008b45] text-white px-[15px] py-[6px] rounded-full text-[11px] font-bold hover:bg-[#007339] disabled:opacity-50 transition-colors shadow-sm"
        >
          {isProcessing ? 'Processing...' : 'Mark as Paid'}
        </button>
      </td>
    </tr>
  );
}
