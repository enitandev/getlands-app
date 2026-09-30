"use client";
import React, { useState } from 'react';
import { executePayoutAction } from '@/app/actions/accounting';
import { toast } from '@/components/ui/Toast';

export default function ClientPayoutRow({ payout, formatCurrency }: { payout: any, formatCurrency: (v: number) => string }) {
  const [loading, setLoading] = useState(false);

  const handlePayout = async () => {
    if (!confirm(`Are you sure you want to process this payout of ${formatCurrency(payout.amount)} to ${payout.user.firstName}?`)) return;
    
    setLoading(true);
    const res = await executePayoutAction(payout.id);
    setLoading(false);
    
    if (res.error) {
      toast(res.error, 'error');
    } else {
      toast('Payout executed successfully!', 'success');
    }
  };

  const isOverdue = new Date(payout.dueDate) < new Date();

  return (
    <tr className="text-[13px] hover:bg-gray-50/50 transition-colors">
      <td className="p-[12px_0]">
        <div className="flex items-center gap-[8px]">
          <span className={`font-bold ${isOverdue ? 'text-red-500' : 'text-ink'}`}>
            {new Date(payout.dueDate).toLocaleDateString()}
          </span>
          {isOverdue && <span className="bg-red-100 text-red-600 text-[9px] font-bold px-[6px] py-[2px] rounded-full uppercase">Overdue</span>}
        </div>
      </td>
      <td className="p-[12px]">
        <div className="font-bold text-ink">{payout.user.firstName} {payout.user.lastName}</div>
        <div className="text-[11px] text-[#68736d]">{payout.user.email}</div>
      </td>
      <td className="p-[12px]">
        <div className="text-[#4a554f]">{payout.holding.opportunity.title}</div>
        <div className="text-[11px] text-[#68736d] font-mono">{payout.type}</div>
      </td>
      <td className="p-[12px] font-bold text-[#008b45] text-[15px]">
        {formatCurrency(payout.amount)}
      </td>
      <td className="p-[12px] text-right">
        <button 
          onClick={handlePayout} 
          disabled={loading}
          className="px-[12px] py-[6px] bg-[#008b45] text-white text-[11px] font-bold rounded-full hover:bg-[#007339] disabled:opacity-50 transition-colors"
        >
          {loading ? 'Processing...' : 'Execute Payout'}
        </button>
      </td>
    </tr>
  );
}
