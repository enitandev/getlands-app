import React from 'react';
import { getCustomerLedger } from '@/app/actions/accounting';

export default async function CustomerLedger({ userId }: { userId: string }) {
  const ledger = await getCustomerLedger(userId);
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);

  return (
    <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col mt-[30px]">
      <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc] flex justify-between items-center">
        <h3 className="font-manrope text-[16px] font-bold text-ink">Accounting Ledger</h3>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-[15px] p-[20px] border-b border-black/5 bg-gray-50/50">
        <div>
          <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Total Deposited</div>
          <strong className="text-[15px] text-ink">{formatCurrency(ledger.totalDeposited)}</strong>
        </div>
        <div>
          <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Total Withdrawn</div>
          <strong className="text-[15px] text-ink">{formatCurrency(ledger.totalWithdrawn)}</strong>
        </div>
        <div>
          <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Active Principal</div>
          <strong className="text-[15px] text-ink">{formatCurrency(ledger.activePrincipal)}</strong>
        </div>
        <div>
          <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Returns Earned</div>
          <strong className="text-[15px] text-[#008b45]">{formatCurrency(ledger.totalReturnsEarned)}</strong>
        </div>
        <div>
          <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Current Wallet</div>
          <strong className="text-[15px] text-[#008b45]">{formatCurrency(ledger.walletBalance)}</strong>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="p-[20px]">
        <h4 className="text-[14px] font-bold text-ink mb-[15px]">Scheduled Payouts</h4>
        {ledger.payouts.length === 0 ? (
          <div className="text-center p-[20px] text-[#68736d] text-[13px] bg-gray-50 rounded-[12px]">
            No scheduled payouts found for this customer.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5 text-[11px] text-[#7a847f] uppercase tracking-wider">
                  <th className="p-[10px_0] font-bold">Due Date</th>
                  <th className="p-[10px] font-bold">Investment</th>
                  <th className="p-[10px] font-bold">Type</th>
                  <th className="p-[10px] font-bold">Amount</th>
                  <th className="p-[10px] font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {ledger.payouts.map(payout => (
                  <tr key={payout.id} className="text-[13px] hover:bg-gray-50/50">
                    <td className="p-[12px_0] font-bold text-ink">
                      {new Date(payout.dueDate).toLocaleDateString()}
                    </td>
                    <td className="p-[12px] text-[#4a554f]">
                      {payout.holding.opportunity.title}
                    </td>
                    <td className="p-[12px] text-[#68736d] font-mono text-[11px]">
                      {payout.type}
                    </td>
                    <td className="p-[12px] font-bold text-[#008b45]">
                      {formatCurrency(payout.amount)}
                    </td>
                    <td className="p-[12px]">
                      <span className={`inline-flex px-[8px] py-[2px] rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        payout.status === 'PAID' ? 'bg-[#eef3ef] text-[#008b45]' :
                        payout.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {payout.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
