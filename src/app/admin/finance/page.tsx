import React from 'react';
import { getMasterLedger, executePayoutAction } from '@/app/actions/accounting';
import ClientPayoutRow from './ClientPayoutRow';
import ClientWithdrawalRow from './ClientWithdrawalRow';

export default async function FinanceDashboard() {
  const ledger = await getMasterLedger();
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);

  return (
    <div className="space-y-[40px] max-w-[1200px] mx-auto p-[20px] lg:p-0">
      <div>
        <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[5px]">Accounting & Finance</h1>
        <p className="text-[13px] text-[#68736d]">Global overview of assets, liabilities, and scheduled payouts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[20px]">
        {/* AUM */}
        <div className="bg-white p-[24px] rounded-[24px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center">
          <div className="w-[40px] h-[40px] rounded-full bg-[#008b45]/10 flex items-center justify-center text-[#008b45] mb-[15px]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <span className="text-[13px] text-[#7a847f] font-bold tracking-[0.03em] uppercase mb-[5px]">Assets Under Mgt.</span>
          <strong className="font-manrope text-[28px] font-bold text-ink leading-none">{formatCurrency(ledger.aum)}</strong>
        </div>

        {/* Liabilities */}
        <div className="bg-white p-[24px] rounded-[24px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center relative overflow-hidden">
          <div className="w-[40px] h-[40px] rounded-full bg-red-500/10 flex items-center justify-center text-red-600 mb-[15px]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
          </div>
          <span className="text-[13px] text-[#7a847f] font-bold tracking-[0.03em] uppercase mb-[5px]">Total Wallet Liabilities</span>
          <strong className="font-manrope text-[28px] font-bold text-red-600 leading-none">{formatCurrency(ledger.walletLiabilities)}</strong>
        </div>

        {/* Escrow Liabilities */}
        <div className="bg-white p-[24px] rounded-[24px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center relative overflow-hidden">
          <div className="w-[40px] h-[40px] rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 mb-[15px]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <span className="text-[13px] text-[#7a847f] font-bold tracking-[0.03em] uppercase mb-[5px]">Agent Escrow (Pending)</span>
          <strong className="font-manrope text-[28px] font-bold text-amber-600 leading-none">{formatCurrency(ledger.escrowLiabilities || 0)}</strong>
        </div>

        {/* Capital Inflow */}
        <div className="bg-white p-[24px] rounded-[24px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center">
          <div className="w-[40px] h-[40px] rounded-full bg-[#008b45]/10 flex items-center justify-center text-[#008b45] mb-[15px]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"></path></svg>
          </div>
          <span className="text-[13px] text-[#7a847f] font-bold tracking-[0.03em] uppercase mb-[5px]">Total Inflow</span>
          <strong className="font-manrope text-[28px] font-bold text-ink leading-none">{formatCurrency(ledger.totalIncoming)}</strong>
        </div>

        {/* Capital Outflow */}
        <div className="bg-white p-[24px] rounded-[24px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center">
          <div className="w-[40px] h-[40px] rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 mb-[15px]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7"></path></svg>
          </div>
          <span className="text-[13px] text-[#7a847f] font-bold tracking-[0.03em] uppercase mb-[5px]">Total Outflow</span>
          <strong className="font-manrope text-[28px] font-bold text-ink leading-none">{formatCurrency(ledger.totalOutgoing)}</strong>
        </div>
      </div>

      {/* Due Payouts */}
      <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col">
        <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc] flex justify-between items-center">
          <div>
            <h3 className="font-manrope text-[16px] font-bold text-ink">Upcoming Payouts (This Month)</h3>
            <p className="text-[13px] text-[#68736d]">Payments due to customers before the end of the current month.</p>
          </div>
          <div className="text-right">
            <span className="block text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[2px]">Total Due</span>
            <strong className="text-[18px] text-[#008b45]">{formatCurrency(ledger.totalUpcomingPayouts)}</strong>
          </div>
        </div>
        
        <div className="p-[20px]">
          {ledger.upcomingPayouts.length === 0 ? (
            <div className="text-center p-[40px] bg-[#f7f9f7] rounded-[16px]">
              <div className="w-[48px] h-[48px] bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-[15px]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008b45" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h3 className="font-manrope text-[16px] font-bold text-ink mb-[5px]">All Caught Up</h3>
              <p className="text-[13px] text-[#68736d]">There are no pending payouts due this month.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-black/5 text-[11px] text-[#7a847f] uppercase tracking-wider">
                    <th className="p-[10px_0] font-bold w-[120px]">Due Date</th>
                    <th className="p-[10px] font-bold">Customer</th>
                    <th className="p-[10px] font-bold">Investment</th>
                    <th className="p-[10px] font-bold">Amount</th>
                    <th className="p-[10px] font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {ledger.upcomingPayouts.map(payout => (
                    <ClientPayoutRow key={payout.id} payout={payout} formatCurrency={formatCurrency} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      {/* Pending Withdrawals */}
      <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col mt-[40px]">
        <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc] flex justify-between items-center">
          <div>
            <h3 className="font-manrope text-[16px] font-bold text-ink">Pending Withdrawal Requests</h3>
            <p className="text-[13px] text-[#68736d]">Customers requesting to transfer their wallet balance to their bank account.</p>
          </div>
        </div>
        
        <div className="p-[20px]">
          {ledger.pendingWithdrawals.length === 0 ? (
            <div className="text-center p-[40px] bg-[#f7f9f7] rounded-[16px]">
              <div className="w-[48px] h-[48px] bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-[15px]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008b45" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h3 className="font-manrope text-[16px] font-bold text-ink mb-[5px]">No Pending Withdrawals</h3>
              <p className="text-[13px] text-[#68736d]">There are currently no active withdrawal requests.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-black/5 text-[11px] text-[#7a847f] uppercase tracking-wider">
                    <th className="p-[10px_0] font-bold w-[120px]">Date</th>
                    <th className="p-[10px] font-bold">Customer</th>
                    <th className="p-[10px] font-bold">Bank Details</th>
                    <th className="p-[10px] font-bold">Amount</th>
                    <th className="p-[10px] font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {ledger.pendingWithdrawals.map(withdrawal => (
                    <ClientWithdrawalRow key={withdrawal.id} withdrawal={withdrawal} formatCurrency={formatCurrency} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
