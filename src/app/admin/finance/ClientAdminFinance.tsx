"use client";
import React, { useState } from 'react';
import { approveTransaction, rejectTransaction } from '@/app/actions/admin';
import { formatCurrency } from '@/lib/mockData';
import ClientPayoutRow from './ClientPayoutRow';
import ClientWithdrawalRow from './ClientWithdrawalRow';

export default function ClientAdminFinance({ transactions = [], ledger }: { transactions: any[], ledger?: any }) {
  const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'ledger'>('pending');
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  const pendingTxs = transactions.filter(t => t.status === 'pending');
  const historyTxs = transactions.filter(t => t.status !== 'pending');

  const handleApprove = async (id: string) => {
    await approveTransaction(id);
    setSelectedTx(null);
    window.location.reload();
  };

  const handleReject = async (id: string) => {
    await rejectTransaction(id);
    setSelectedTx(null);
    window.location.reload();
  };

  return (
    <div className="space-y-[30px]">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[10px]">Finance & Verifications</h1>
          <p className="text-[13px] lg:text-[14px] text-[#68736d]">Verify customer bank transfers, view history, and manage ROI payouts.</p>
        </div>
      </div>

      <div className="flex gap-[20px] lg:gap-[30px] border-b border-black/10 overflow-x-auto scrollbar-hide">
        <button onClick={() => setActiveTab('pending')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'pending' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
          Pending Verifications <span className="ml-[8px] px-[6px] py-[2px] bg-[#f5a623] text-white text-[10px] rounded-full">{pendingTxs.length}</span>
          {activeTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
        </button>
        <button onClick={() => setActiveTab('history')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'history' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
          Transaction History
          {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
        </button>
        {ledger && (
          <button onClick={() => setActiveTab('ledger')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'ledger' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
            Master Ledger & Payouts
            {activeTab === 'ledger' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
          </button>
        )}
      </div>

      {activeTab === 'pending' && (
        <div className="bg-white rounded-[20px] shadow-sm border border-black/5 overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1.5fr_2fr_1fr_1fr_100px] gap-[20px] p-[20px_24px] bg-[#fcfdfc] border-b border-black/5 text-[11px] font-bold text-[#7a847f] uppercase tracking-[0.05em]">
            <div>Customer</div>
            <div>Type</div>
            <div>Amount</div>
            <div>Date</div>
            <div className="text-right">Action</div>
          </div>
          <div className="divide-y divide-black/5">
            {pendingTxs.map(tx => (
              <div key={tx.id} className="grid grid-cols-1 lg:grid-cols-[1.5fr_2fr_1fr_1fr_100px] gap-[15px] lg:gap-[20px] p-[20px] lg:p-[20px_24px] items-start lg:items-center hover:bg-[#fcfdfc] transition-colors">
                <div>
                  <strong className="block text-[14px] text-ink">{tx.user.firstName} {tx.user.lastName}</strong>
                  <span className="text-[12px] text-[#68736d]">{tx.user.email}</span>
                </div>
                <div>
                  <strong className="block text-[14px] text-ink capitalize">{tx.type}</strong>
                  <span className="text-[12px] text-[#68736d]">{tx.reference}</span>
                </div>
                <div>
                  <strong className="text-[15px] text-ink font-bold">{formatCurrency(tx.amount)}</strong>
                </div>
                <div className="text-[13px] text-[#68736d]">
                  {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="text-right">
                  <button onClick={() => setSelectedTx(tx)} className="px-[16px] py-[8px] bg-[#008b45] text-white text-[12px] font-bold rounded-full hover:bg-[#007339] transition-colors">
                    Review
                  </button>
                </div>
              </div>
            ))}
            {pendingTxs.length === 0 && <div className="p-8 text-center text-[#68736d] text-sm">No pending transactions.</div>}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-[20px] shadow-sm border border-black/5 overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1.5fr_2fr_1fr_1fr_100px] gap-[20px] p-[20px_24px] bg-[#fcfdfc] border-b border-black/5 text-[11px] font-bold text-[#7a847f] uppercase tracking-[0.05em]">
            <div>Customer</div>
            <div>Type</div>
            <div>Amount</div>
            <div>Status</div>
            <div className="text-right">Action</div>
          </div>
          <div className="divide-y divide-black/5">
            {historyTxs.map(tx => (
              <div key={tx.id} className="grid grid-cols-1 lg:grid-cols-[1.5fr_2fr_1fr_1fr_100px] gap-[15px] lg:gap-[20px] p-[20px] lg:p-[20px_24px] items-start lg:items-center hover:bg-[#fcfdfc] transition-colors">
                <div>
                  <strong className="block text-[14px] text-ink">{tx.user.firstName} {tx.user.lastName}</strong>
                  <span className="text-[12px] text-[#68736d]">{tx.user.email}</span>
                </div>
                <div>
                  <strong className="block text-[14px] text-ink capitalize">{tx.type}</strong>
                  <span className="text-[12px] text-[#68736d]">{tx.reference}</span>
                </div>
                <div>
                  <strong className="text-[15px] text-ink font-bold">{formatCurrency(tx.amount)}</strong>
                </div>
                <div>
                  <span className={`px-[8px] py-[4px] rounded-full text-[10px] font-bold uppercase ${tx.status === 'success' ? 'bg-[#eef3ef] text-[#008b45]' : 'bg-[#fdeeee] text-[#e53935]'}`}>
                    {tx.status}
                  </span>
                </div>
                <div className="text-right">
                  -
                </div>
              </div>
            ))}
            {historyTxs.length === 0 && <div className="p-8 text-center text-[#68736d] text-sm">No transaction history.</div>}
          </div>
        </div>
      )}

      {activeTab === 'ledger' && ledger && (
        <div className="space-y-[40px]">
          {/* AUM & Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[20px]">
            {/* AUM */}
            <div className="bg-white p-[24px] rounded-[24px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center">
              <div className="w-[40px] h-[40px] rounded-full bg-[#008b45]/10 flex items-center justify-center text-[#008b45] mb-[15px]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <span className="text-[13px] text-[#7a847f] font-bold tracking-[0.03em] uppercase mb-[5px]">Assets Under Mgt.</span>
              <strong className="font-manrope text-[28px] font-bold text-ink leading-none">{formatCurrency(ledger.aum || 0)}</strong>
            </div>

            {/* Liabilities */}
            <div className="bg-white p-[24px] rounded-[24px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center relative overflow-hidden">
              <div className="w-[40px] h-[40px] rounded-full bg-red-500/10 flex items-center justify-center text-red-600 mb-[15px]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
              </div>
              <span className="text-[13px] text-[#7a847f] font-bold tracking-[0.03em] uppercase mb-[5px]">Total Wallet Liabilities</span>
              <strong className="font-manrope text-[28px] font-bold text-red-600 leading-none">{formatCurrency(ledger.walletLiabilities || 0)}</strong>
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
              <strong className="font-manrope text-[28px] font-bold text-ink leading-none">{formatCurrency(ledger.totalIncoming || 0)}</strong>
            </div>

            {/* Capital Outflow */}
            <div className="bg-white p-[24px] rounded-[24px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center">
              <div className="w-[40px] h-[40px] rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 mb-[15px]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7"></path></svg>
              </div>
              <span className="text-[13px] text-[#7a847f] font-bold tracking-[0.03em] uppercase mb-[5px]">Total Outflow</span>
              <strong className="font-manrope text-[28px] font-bold text-ink leading-none">{formatCurrency(ledger.totalOutgoing || 0)}</strong>
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
                <strong className="text-[18px] text-[#008b45]">{formatCurrency(ledger.totalUpcomingPayouts || 0)}</strong>
              </div>
            </div>
            
            <div className="p-[20px]">
              {(!ledger.upcomingPayouts || ledger.upcomingPayouts.length === 0) ? (
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
                      {ledger.upcomingPayouts.map((payout: any) => (
                        <ClientPayoutRow key={payout.id} payout={payout} formatCurrency={formatCurrency} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Pending Withdrawals */}
          <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col">
            <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc] flex justify-between items-center">
              <div>
                <h3 className="font-manrope text-[16px] font-bold text-ink">Pending Withdrawal Requests</h3>
                <p className="text-[13px] text-[#68736d]">Customers requesting to transfer their wallet balance to their bank account.</p>
              </div>
            </div>
            
            <div className="p-[20px]">
              {(!ledger.pendingWithdrawals || ledger.pendingWithdrawals.length === 0) ? (
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
                      {ledger.pendingWithdrawals.map((withdrawal: any) => (
                        <ClientWithdrawalRow key={withdrawal.id} withdrawal={withdrawal} formatCurrency={formatCurrency} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedTx && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl overflow-hidden">
            <div className="p-[20px] lg:p-[30px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
              <h2 className="font-manrope text-[20px] font-bold text-ink">Review Transfer</h2>
              <button onClick={() => setSelectedTx(null)} className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center hover:bg-[#eef3ef]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-[30px] space-y-[20px]">
              <div className="space-y-[15px] bg-[#fcfdfc] p-[20px] rounded-[16px] border border-black/5">
                <div>
                  <span className="block text-[12px] text-[#7a847f] mb-[2px]">Customer</span>
                  <strong className="block text-[15px] text-ink">{selectedTx.user.firstName} {selectedTx.user.lastName}</strong>
                </div>
                <div>
                  <span className="block text-[12px] text-[#7a847f] mb-[2px]">Type</span>
                  <strong className="block text-[15px] text-ink capitalize">{selectedTx.type}</strong>
                </div>
                <div>
                  <span className="block text-[12px] text-[#7a847f] mb-[2px]">Expected Amount</span>
                  <strong className="block text-[24px] font-manrope text-[#008b45]">{formatCurrency(selectedTx.amount)}</strong>
                </div>

                {selectedTx.type === 'investment' && (
                  <div className="pt-[10px] border-t border-black/5">
                    <span className="block text-[12px] text-[#7a847f] mb-[6px] font-bold uppercase tracking-wider">Proof of Payment</span>
                    <a 
                      href={`/api/receipt/${selectedTx.reference}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-[8px] px-[16px] py-[10px] bg-[#008b45]/10 hover:bg-[#008b45]/20 text-[#008b45] font-bold text-[13px] rounded-[12px] transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      View Uploaded Receipt ↗
                    </a>
                  </div>
                )}
                
                {selectedTx.type === 'withdrawal' && selectedTx.user.bankAccounts?.[0] && (
                  <div className="pt-[10px] border-t border-black/5 mt-[10px]">
                    <span className="block text-[12px] text-[#7a847f] mb-[8px] uppercase tracking-wider font-bold">Transfer To</span>
                    <div className="bg-[#eef3ef]/50 p-[15px] rounded-[12px] space-y-[8px]">
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-[#68736d]">Bank:</span>
                        <strong className="text-ink">{selectedTx.user.bankAccounts[0].bankName}</strong>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-[#68736d]">Name:</span>
                        <strong className="text-ink">{selectedTx.user.bankAccounts[0].accountName}</strong>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-[#68736d]">Account:</span>
                        <strong className="font-mono text-ink text-[15px] tracking-wider">{selectedTx.user.bankAccounts[0].accountNumber}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-[15px]">
                <button onClick={() => handleReject(selectedTx.id)} className="flex-1 py-[14px] bg-[#fdeeee] text-[#e53935] font-bold rounded-full">Reject</button>
                <button onClick={() => handleApprove(selectedTx.id)} className="flex-[2] py-[14px] bg-[#008b45] text-white font-bold rounded-full shadow-[0_8px_20px_rgba(0,139,69,0.25)]">
                  {selectedTx.type === 'withdrawal' ? 'Mark as Transferred' : 'Approve & Verify'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
