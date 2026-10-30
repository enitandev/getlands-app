import React from 'react';
import { getCustomerLedger } from '@/app/actions/accounting';
import ClientPayoutRow from '../../finance/ClientPayoutRow';
import ClientCommissionRow from '../../finance/ClientCommissionRow';

export default async function CustomerLedger({ userId }: { userId: string }) {
  const ledger = await getCustomerLedger(userId);
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);

  return (
    <div className="space-y-[30px] mt-[30px]">
      {ledger.commissions && ledger.commissions.length > 0 && (
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col">
          <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc] flex justify-between items-center">
            <div>
              <h3 className="font-manrope text-[16px] font-bold text-ink">Sales Agent Commissions</h3>
              <p className="text-[12px] text-[#68736d]">Pay pending commissions directly to bank or credit to wallet.</p>
            </div>
            <span className="text-[12px] font-bold text-[#008b45]">
              {ledger.commissions.filter((c: any) => c.status === 'PENDING').length} Pending
            </span>
          </div>
          <div className="p-[20px] overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-black/5 text-[11px] text-[#7a847f] uppercase tracking-wider">
                  <th className="p-[10px_0] font-bold w-[130px]">Date & Escrow</th>
                  <th className="p-[10px] font-bold">Agent & Bank</th>
                  <th className="p-[10px] font-bold">Client & Deal</th>
                  <th className="p-[10px] font-bold">Commission</th>
                  <th className="p-[10px] font-bold text-right">Action / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {ledger.commissions.map((comm: any) => (
                  <ClientCommissionRow key={comm.id} commission={comm} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col">
        <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc] flex justify-between items-center">
          <h3 className="font-manrope text-[16px] font-bold text-ink">Accounting Ledger</h3>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[15px] p-[20px] border-b border-black/5 bg-gray-50/50">
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
            <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Expected Total ROI</div>
            <strong className="text-[15px] text-[#008b45]">{formatCurrency(ledger.totalExpectedROI)}</strong>
          </div>
          <div>
            <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Current Wallet</div>
            <strong className="text-[15px] text-ink">{formatCurrency(ledger.walletBalance)}</strong>
          </div>
        </div>

        {/* Payouts Table */}
        <div className="p-[20px]">
          <div className="flex justify-between items-center mb-[15px]">
            <h4 className="text-[14px] font-bold text-ink">Scheduled Payouts Breakdown</h4>
            <span className="text-[12px] text-[#68736d]">Pay directly to bank or credit to wallet</span>
          </div>
          {ledger.payouts.length === 0 ? (
            <div className="text-center p-[20px] text-[#68736d] text-[13px] bg-gray-50 rounded-[12px]">
              No scheduled payouts found for this customer.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="border-b border-black/5 text-[11px] text-[#7a847f] uppercase tracking-wider">
                    <th className="p-[10px_0] font-bold w-[120px]">Due Date</th>
                    <th className="p-[10px] font-bold">Customer & Bank</th>
                    <th className="p-[10px] font-bold">Investment</th>
                    <th className="p-[10px] font-bold">Amount</th>
                    <th className="p-[10px] font-bold text-right">Action / Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {ledger.payouts.map((payout: any) => (
                    <ClientPayoutRow key={payout.id} payout={payout} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
