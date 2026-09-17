"use client";
import React, { useState } from 'react';
import { approveTransaction, rejectTransaction } from '@/app/actions/admin';
import { formatCurrency } from '@/lib/mockData';

export default function ClientAdminFinance({ transactions }: { transactions: any[] }) {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
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
          <p className="text-[13px] lg:text-[14px] text-[#68736d]">Manage payments, verify manual transfers, and process payouts.</p>
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
                  <span className="block text-[12px] text-[#7a847f] mb-[2px]">Expected Amount</span>
                  <strong className="block text-[24px] font-manrope text-[#008b45]">{formatCurrency(selectedTx.amount)}</strong>
                </div>
              </div>
              <div className="flex gap-[15px]">
                <button onClick={() => handleReject(selectedTx.id)} className="flex-1 py-[14px] bg-[#fdeeee] text-[#e53935] font-bold rounded-full">Reject</button>
                <button onClick={() => handleApprove(selectedTx.id)} className="flex-[2] py-[14px] bg-[#008b45] text-white font-bold rounded-full shadow-[0_8px_20px_rgba(0,139,69,0.25)]">Approve & Verify</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
