"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { approveTransaction, rejectTransaction, bulkApproveTransactions, bulkRejectTransactions } from '@/app/actions/admin';
import { releaseDueCommissionsAction } from '@/app/actions/admin-ops';
import { formatCurrency } from '@/lib/mockData';
import { toast } from '@/components/ui/Toast';
import ClientPayoutRow from './ClientPayoutRow';
import ClientCommissionRow from './ClientCommissionRow';
import ClientWithdrawalRow from './ClientWithdrawalRow';
import ClientWalletLiabilityRow from './ClientWalletLiabilityRow';

type FinanceTab = 'pending' | 'commissions' | 'ledger' | 'history';

export default function ClientAdminFinance({
  transactions = [],
  ledger,
  initialTab
}: {
  transactions: any[];
  ledger?: any;
  initialTab?: string;
}) {
  const router = useRouter();
  const resolveTab = (t?: string): FinanceTab => {
    if (t === 'commissions' || t === 'ledger' || t === 'history' || t === 'pending') return t;
    if (t === 'payouts') return 'ledger';
    return 'pending';
  };

  const [activeTab, setActiveTab] = useState<FinanceTab>(resolveTab(initialTab));
  const [txList, setTxList] = useState<any[]>(transactions);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [commissionFilter, setCommissionFilter] = useState<'PENDING' | 'PAID' | 'VOID' | 'ALL'>('PENDING');
  const [payoutFilter, setPayoutFilter] = useState<'MONTH' | 'ALL_PENDING' | 'PAID'>('ALL_PENDING');
  const [isReleasingComms, setIsReleasingComms] = useState(false);

  useEffect(() => {
    setTxList(transactions);
  }, [transactions]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(resolveTab(initialTab));
    }
  }, [initialTab]);

  const pendingTxs = txList.filter(t => t.status === 'pending');
  const historyTxs = txList.filter(t => t.status !== 'pending');

  const allCommissions: any[] = ledger?.commissions || [];
  const pendingCommissions = allCommissions.filter(c => c.status === 'PENDING');
  const paidCommissions = allCommissions.filter(c => c.status === 'PAID');
  const voidCommissions = allCommissions.filter(c => c.status === 'VOID');

  const filteredCommissions =
    commissionFilter === 'ALL'
      ? allCommissions
      : allCommissions.filter(c => c.status === commissionFilter);

  const displayedPayouts: any[] =
    payoutFilter === 'MONTH'
      ? ledger?.upcomingPayouts || []
      : payoutFilter === 'PAID'
        ? ledger?.recentPaidPayouts || []
        : ledger?.allPendingPayouts || ledger?.upcomingPayouts || [];

  const handleReleaseMaturedCommissions = async () => {
    if (
      !confirm(
        "Release all commissions that have completed the 7-day escrow period into agents' wallets now?"
      )
    )
      return;
    setIsReleasingComms(true);
    try {
      const res = await releaseDueCommissionsAction();
      if (res.count > 0) {
        toast(`Released ${res.count} matured commission(s) to agent wallets!`, 'success');
      } else {
        toast('No commissions have passed 7 days yet. Use the row buttons below to pay any commission immediately.', 'info');
      }
      router.refresh();
    } catch (e: any) {
      toast(e.message || 'Failed to release commissions', 'error');
    } finally {
      setIsReleasingComms(false);
    }
  };

  const selectedTotal = pendingTxs
    .filter(t => selectedIds.includes(t.id))
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const toggleSelectAll = () => {
    if (selectedIds.length === pendingTxs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingTxs.map(t => t.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleApprove = async (id: string) => {
    setIsProcessing(id);
    try {
      const res = await approveTransaction(id);
      if (res?.error) {
        toast(res.error, 'error');
      } else {
        toast('Payment verified and holding activated!', 'success');
        setTxList(prev => prev.map(t => t.id === id ? { ...t, status: 'success' } : t));
        setSelectedTx(null);
        setSelectedIds(prev => prev.filter(item => item !== id));
        router.refresh();
      }
    } catch (err: any) {
      toast(err.message || 'Approval failed', 'error');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    setIsProcessing(id);
    try {
      const res = await rejectTransaction(id);
      if (res?.error) {
        toast(res.error, 'error');
      } else {
        toast('Transaction rejected', 'info');
        setTxList(prev => prev.map(t => t.id === id ? { ...t, status: 'failed' } : t));
        setSelectedTx(null);
        setSelectedIds(prev => prev.filter(item => item !== id));
        router.refresh();
      }
    } catch (err: any) {
      toast(err.message || 'Rejection failed', 'error');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to approve ${selectedIds.length} transfers totaling ${formatCurrency(selectedTotal)}? This will activate all holdings and trigger referral bonuses.`)) return;

    setIsProcessing('bulk-approve');
    try {
      const res = await bulkApproveTransactions(selectedIds);
      if (res?.success) {
        toast(`Successfully approved ${res.count} transactions!`, 'success');
        setTxList(prev => prev.map(t => selectedIds.includes(t.id) ? { ...t, status: 'success' } : t));
        setSelectedIds([]);
        router.refresh();
      } else {
        toast('Bulk approval failed', 'error');
      }
    } catch (e: any) {
      toast(e.message || 'Bulk approval failed', 'error');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to reject ${selectedIds.length} pending transfers?`)) return;

    setIsProcessing('bulk-reject');
    try {
      const res = await bulkRejectTransactions(selectedIds);
      if (res?.success) {
        toast(`Successfully rejected ${res.count} transactions`, 'info');
        setTxList(prev => prev.map(t => selectedIds.includes(t.id) ? { ...t, status: 'failed' } : t));
        setSelectedIds([]);
        router.refresh();
      } else {
        toast('Bulk rejection failed', 'error');
      }
    } catch (e: any) {
      toast(e.message || 'Bulk rejection failed', 'error');
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="space-y-[30px] pb-[80px]">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[10px]">Finance & Verifications</h1>
          <p className="text-[13px] lg:text-[14px] text-[#68736d]">Verify customer bank transfers, pay sales agent commissions, and manage ROI payouts.</p>
        </div>
      </div>

      <div className="flex gap-[20px] lg:gap-[30px] border-b border-black/10 overflow-x-auto scrollbar-hide">
        <button onClick={() => setActiveTab('pending')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'pending' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
          Pending Verifications <span className="ml-[8px] px-[6px] py-[2px] bg-[#f5a623] text-white text-[10px] rounded-full">{pendingTxs.length}</span>
          {activeTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
        </button>
        {ledger && (
          <button onClick={() => setActiveTab('commissions')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'commissions' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
            Agent Commissions
            <span className={`ml-[8px] px-[6px] py-[2px] text-[10px] rounded-full ${pendingCommissions.length > 0 ? 'bg-amber-500 text-white' : 'bg-[#eef3ef] text-[#008b45]'}`}>
              {pendingCommissions.length}
            </span>
            {activeTab === 'commissions' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
          </button>
        )}
        {ledger && (
          <button onClick={() => setActiveTab('ledger')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'ledger' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
            Master Ledger & Payouts
            {(ledger.allPendingPayouts?.length || 0) > 0 && (
              <span className="ml-[8px] px-[6px] py-[2px] bg-[#008b45] text-white text-[10px] rounded-full">
                {ledger.allPendingPayouts.length}
              </span>
            )}
            {activeTab === 'ledger' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
          </button>
        )}
        <button onClick={() => setActiveTab('history')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'history' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
          Transaction History
          {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
        </button>
      </div>

      {activeTab === 'pending' && (
        <div className="space-y-4">
          {/* Bulk Action Banner */}
          {selectedIds.length > 0 && (
            <div className="bg-[#18201c] text-white p-4 rounded-[16px] flex flex-wrap items-center justify-between gap-4 shadow-lg animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#008b45] flex items-center justify-center font-bold text-xs">{selectedIds.length}</span>
                <span className="font-bold text-sm">Selected Transfers</span>
                <span className="text-white/60 text-xs">|</span>
                <span className="font-manrope font-extrabold text-[#a9e7bd] text-sm">Total: {formatCurrency(selectedTotal)}</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleBulkApprove} 
                  disabled={isProcessing !== null}
                  className="px-5 py-2.5 bg-[#008b45] hover:bg-[#007339] text-white text-xs font-bold rounded-full transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isProcessing === 'bulk-approve' ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                      Approving {selectedIds.length}...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Approve Selected ({selectedIds.length})
                    </>
                  )}
                </button>
                <button 
                  onClick={handleBulkReject} 
                  disabled={isProcessing !== null}
                  className="px-4 py-2.5 bg-white/10 hover:bg-red-500/80 text-white text-xs font-bold rounded-full transition-colors disabled:opacity-50"
                >
                  {isProcessing === 'bulk-reject' ? 'Rejecting...' : 'Reject Selected'}
                </button>
                <button 
                  onClick={() => setSelectedIds([])} 
                  className="text-xs text-white/70 hover:text-white px-2 py-1 font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-[20px] shadow-sm border border-black/5 overflow-hidden">
            <div className="hidden lg:grid grid-cols-[40px_1.5fr_1.8fr_1fr_1fr_180px] gap-[15px] p-[20px_24px] bg-[#fcfdfc] border-b border-black/5 text-[11px] font-bold text-[#7a847f] uppercase tracking-[0.05em] items-center">
              <div>
                <input 
                  type="checkbox" 
                  checked={pendingTxs.length > 0 && selectedIds.length === pendingTxs.length} 
                  onChange={toggleSelectAll} 
                  className="w-4 h-4 rounded accent-[#008b45] cursor-pointer" 
                />
              </div>
              <div>Customer</div>
              <div>Type & Reference</div>
              <div>Amount</div>
              <div>Date</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-black/5">
              {pendingTxs.map(tx => {
                const isSelected = selectedIds.includes(tx.id);
                const isItemProcessing = isProcessing === tx.id;
                return (
                  <div key={tx.id} className={`grid grid-cols-1 lg:grid-cols-[40px_1.5fr_1.8fr_1fr_1fr_180px] gap-[15px] p-[20px] lg:p-[20px_24px] items-start lg:items-center hover:bg-[#fcfdfc] transition-colors ${isSelected ? 'bg-[#008b45]/5' : ''}`}>
                    <div className="hidden lg:block">
                      <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => toggleSelectOne(tx.id)} 
                        className="w-4 h-4 rounded accent-[#008b45] cursor-pointer" 
                      />
                    </div>
                    <div>
                      <strong className="block text-[14px] text-ink">{tx.user?.firstName || 'User'} {tx.user?.lastName || ''}</strong>
                      <span className="text-[12px] text-[#68736d]">{tx.user?.email || 'N/A'}</span>
                    </div>
                    <div>
                      <strong className="block text-[14px] text-ink capitalize">{tx.type}</strong>
                      <span className="text-[12px] text-[#68736d] font-mono">{tx.reference}</span>
                    </div>
                    <div>
                      <strong className="text-[15px] text-[#008b45] font-bold font-manrope">{formatCurrency(tx.amount)}</strong>
                    </div>
                    <div className="text-[13px] text-[#68736d]">
                      {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedTx(tx)} 
                        className="px-[14px] py-[7px] bg-[#f4f7f5] text-ink border border-black/10 text-[12px] font-bold rounded-full hover:bg-black/5 transition-colors"
                      >
                        Review
                      </button>
                      <button 
                        onClick={() => handleApprove(tx.id)} 
                        disabled={isProcessing !== null}
                        className="px-[14px] py-[7px] bg-[#008b45] text-white text-[12px] font-bold rounded-full hover:bg-[#007339] disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        {isItemProcessing ? (
                          <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        )}
                        {isItemProcessing ? 'Saving...' : 'Approve'}
                      </button>
                    </div>
                  </div>
                );
              })}
              {pendingTxs.length === 0 && (
                <div className="p-12 text-center text-[#68736d] text-sm">
                  <div className="w-12 h-12 rounded-full bg-[#008b45]/10 text-[#008b45] flex items-center justify-center mx-auto mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <strong className="block text-ink text-base mb-1">No Pending Verifications</strong>
                  <span>All customer bank transfers and deposits have been verified.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-[20px] shadow-sm border border-black/5 overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1.5fr_2fr_1fr_1fr_100px] gap-[20px] p-[20px_24px] bg-[#fcfdfc] border-b border-black/5 text-[11px] font-bold text-[#7a847f] uppercase tracking-[0.05em]">
            <div>Customer</div>
            <div>Type & Reference</div>
            <div>Amount</div>
            <div>Status</div>
            <div className="text-right">Date</div>
          </div>
          <div className="divide-y divide-black/5">
            {historyTxs.map(tx => (
              <div key={tx.id} className="grid grid-cols-1 lg:grid-cols-[1.5fr_2fr_1fr_1fr_100px] gap-[15px] lg:gap-[20px] p-[20px] lg:p-[20px_24px] items-start lg:items-center hover:bg-[#fcfdfc] transition-colors">
                <div>
                  <strong className="block text-[14px] text-ink">{tx.user?.firstName || 'User'} {tx.user?.lastName || ''}</strong>
                  <span className="text-[12px] text-[#68736d]">{tx.user?.email || 'N/A'}</span>
                </div>
                <div>
                  <strong className="block text-[14px] text-ink capitalize">{tx.type}</strong>
                  <span className="text-[12px] text-[#68736d] font-mono">{tx.reference}</span>
                </div>
                <div>
                  <strong className="text-[15px] text-ink font-bold font-manrope">{formatCurrency(tx.amount)}</strong>
                </div>
                <div>
                  <span className={`px-[10px] py-[4px] rounded-full text-[10px] font-bold uppercase tracking-wider ${tx.status === 'success' ? 'bg-[#eef3ef] text-[#008b45]' : 'bg-[#fdeeee] text-[#e53935]'}`}>
                    {tx.status}
                  </span>
                </div>
                <div className="text-right text-[13px] text-[#68736d]">
                  {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            ))}
            {historyTxs.length === 0 && <div className="p-8 text-center text-[#68736d] text-sm">No transaction history.</div>}
          </div>
        </div>
      )}

      {activeTab === 'commissions' && ledger && (
        <div className="space-y-[30px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            <div className="bg-white p-[24px] rounded-[24px] border border-black/5 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[12px] text-[#7a847f] font-bold uppercase tracking-[0.05em] block mb-[6px]">
                  Pending Agent Commissions
                </span>
                <strong className="font-manrope text-[28px] font-bold text-amber-600 leading-none block">
                  {formatCurrency(ledger.escrowLiabilities || 0)}
                </strong>
              </div>
              <p className="text-[12px] text-[#68736d] mt-[10px]">
                {pendingCommissions.length} pending commission{pendingCommissions.length === 1 ? '' : 's'} waiting for payout.
              </p>
            </div>

            <div className="bg-white p-[24px] rounded-[24px] border border-black/5 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[12px] text-[#7a847f] font-bold uppercase tracking-[0.05em] block mb-[6px]">
                  Total Commissions Paid
                </span>
                <strong className="font-manrope text-[28px] font-bold text-[#008b45] leading-none block">
                  {formatCurrency(ledger.paidCommissionsTotal || 0)}
                </strong>
              </div>
              <p className="text-[12px] text-[#68736d] mt-[10px]">
                {paidCommissions.length} commission{paidCommissions.length === 1 ? '' : 's'} settled via bank or wallet.
              </p>
            </div>

            <div className="bg-[#182a20] text-white p-[24px] rounded-[24px] flex flex-col justify-between">
              <div>
                <span className="text-[12px] text-[#a6baa9] font-bold uppercase tracking-[0.05em] block mb-[6px]">
                  Batch Escrow Release
                </span>
                <p className="text-[12px] text-white/80 leading-relaxed">
                  Release all commissions that have completed the 7-day cooling-off period to agent wallets, or pay any commission below immediately.
                </p>
              </div>
              <button
                type="button"
                onClick={handleReleaseMaturedCommissions}
                disabled={isReleasingComms}
                className="mt-[14px] px-[18px] py-[10px] bg-[#008b45] hover:bg-[#007339] text-white text-[12px] font-bold rounded-full transition-colors w-fit disabled:opacity-50"
              >
                {isReleasingComms ? 'Releasing...' : 'Release Matured (7d+) to Wallets'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col">
            <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc] flex flex-col sm:flex-row justify-between sm:items-center gap-[12px]">
              <div>
                <h3 className="font-manrope text-[16px] font-bold text-ink">
                  Sales Agent Commission Disbursements
                </h3>
                <p className="text-[13px] text-[#68736d]">
                  Pay sales agents directly to their bank account or credit their Getlands digital wallet. Agents receive an immediate notification and email.
                </p>
              </div>
              <div className="flex items-center gap-[8px] flex-wrap">
                {([
                  { id: 'PENDING', label: `Pending (${pendingCommissions.length})` },
                  { id: 'PAID', label: `Paid (${paidCommissions.length})` },
                  { id: 'VOID', label: `Cancelled (${voidCommissions.length})` },
                  { id: 'ALL', label: `All (${allCommissions.length})` }
                ] as const).map(pill => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setCommissionFilter(pill.id)}
                    className={`px-[12px] py-[6px] rounded-full text-[11px] font-bold transition-colors ${
                      commissionFilter === pill.id
                        ? 'bg-[#182a20] text-white'
                        : 'bg-[#f4f7f5] text-[#68736d] hover:text-ink'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-[20px]">
              {filteredCommissions.length === 0 ? (
                <div className="text-center p-[40px] bg-[#f7f9f7] rounded-[16px]">
                  <div className="w-[48px] h-[48px] bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-[15px]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008b45" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <h3 className="font-manrope text-[16px] font-bold text-ink mb-[5px]">
                    No {commissionFilter === 'ALL' ? '' : commissionFilter.toLowerCase()} commissions found
                  </h3>
                  <p className="text-[13px] text-[#68736d]">
                    {commissionFilter === 'PENDING'
                      ? 'All sales agent commissions have been paid out.'
                      : 'Switch filters above to view other commission records.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[850px]">
                    <thead>
                      <tr className="border-b border-black/5 text-[11px] text-[#7a847f] uppercase tracking-wider">
                        <th className="p-[10px_0] font-bold w-[130px]">Date & Escrow</th>
                        <th className="p-[10px] font-bold">Sales Agent & Bank</th>
                        <th className="p-[10px] font-bold">Client & Deal</th>
                        <th className="p-[10px] font-bold">Commission</th>
                        <th className="p-[10px] font-bold text-right">Action / Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {filteredCommissions.map((comm: any) => (
                        <ClientCommissionRow key={comm.id} commission={comm} formatCurrency={formatCurrency} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
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

            {/* Liabilities - Clickable */}
            <button
              type="button"
              onClick={() => document.getElementById('wallet-liabilities-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-left bg-white p-[24px] rounded-[24px] border border-black/5 hover:border-red-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center relative overflow-hidden transition-all group"
            >
              <div className="w-[40px] h-[40px] rounded-full bg-red-500/10 flex items-center justify-center text-red-600 mb-[15px]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
              </div>
              <span className="text-[13px] text-[#7a847f] font-bold tracking-[0.03em] uppercase mb-[5px]">Total Wallet Liabilities</span>
              <strong className="font-manrope text-[28px] font-bold text-red-600 leading-none">{formatCurrency(ledger.walletLiabilities || 0)}</strong>
              <span className="text-[11px] font-bold text-red-600/80 group-hover:underline mt-[8px]">
                View balances &rarr;
              </span>
            </button>

            {/* Escrow Liabilities - Clickable to view & pay sales agents */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('agent-commissions-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveTab('commissions');
                }
              }}
              className="text-left bg-white p-[24px] rounded-[24px] border border-amber-500/30 hover:border-amber-500 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center relative overflow-hidden transition-all group"
            >
              <div className="w-[40px] h-[40px] rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 mb-[15px]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <span className="text-[13px] text-[#7a847f] font-bold tracking-[0.03em] uppercase mb-[5px]">Agent Escrow (Pending)</span>
              <strong className="font-manrope text-[28px] font-bold text-amber-600 leading-none">{formatCurrency(ledger.escrowLiabilities || 0)}</strong>
              <span className="text-[11px] font-bold text-amber-700 group-hover:underline mt-[8px]">
                Click to view &amp; pay ({pendingCommissions.length}) &rarr;
              </span>
            </button>

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

          {/* Sales Agent Commissions Due Section right inside Master Ledger */}
          <div id="agent-commissions-section" className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col">
            <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc] flex flex-col sm:flex-row justify-between sm:items-center gap-[12px]">
              <div>
                <h3 className="font-manrope text-[16px] font-bold text-ink">
                  Payments Due to Sales Agents (Commissions)
                </h3>
                <p className="text-[13px] text-[#68736d]">
                  Pay sales agents directly to their bank account or credit their Getlands wallet. Notifications and emails are sent automatically.
                </p>
              </div>
              <div className="flex items-center gap-[8px] flex-wrap">
                {([
                  { id: 'PENDING', label: `Pending (${pendingCommissions.length})` },
                  { id: 'PAID', label: `Paid (${paidCommissions.length})` },
                  { id: 'VOID', label: `Cancelled (${voidCommissions.length})` },
                  { id: 'ALL', label: `All (${allCommissions.length})` }
                ] as const).map(pill => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setCommissionFilter(pill.id)}
                    className={`px-[12px] py-[6px] rounded-full text-[11px] font-bold transition-colors ${
                      commissionFilter === pill.id
                        ? 'bg-[#182a20] text-white'
                        : 'bg-[#f4f7f5] text-[#68736d] hover:text-ink'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-[20px]">
              {filteredCommissions.length === 0 ? (
                <div className="text-center p-[40px] bg-[#f7f9f7] rounded-[16px]">
                  <div className="w-[48px] h-[48px] bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-[15px]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008b45" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <h3 className="font-manrope text-[16px] font-bold text-ink mb-[5px]">
                    No {commissionFilter === 'ALL' ? '' : commissionFilter.toLowerCase()} agent commissions
                  </h3>
                  <p className="text-[13px] text-[#68736d]">
                    {commissionFilter === 'PENDING'
                      ? 'All sales agent commissions are currently settled.'
                      : 'Switch filters above to view other commission records.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[850px]">
                    <thead>
                      <tr className="border-b border-black/5 text-[11px] text-[#7a847f] uppercase tracking-wider">
                        <th className="p-[10px_0] font-bold w-[130px]">Date & Escrow</th>
                        <th className="p-[10px] font-bold">Sales Agent & Bank</th>
                        <th className="p-[10px] font-bold">Client & Deal</th>
                        <th className="p-[10px] font-bold">Commission</th>
                        <th className="p-[10px] font-bold text-right">Action / Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {filteredCommissions.map((comm: any) => (
                        <ClientCommissionRow key={comm.id} commission={comm} formatCurrency={formatCurrency} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Active Wallet Liabilities & Settlement Reconciliation */}
          <div id="wallet-liabilities-section" className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col">
            <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc] flex flex-col sm:flex-row justify-between sm:items-center gap-[10px]">
              <div>
                <h3 className="font-manrope text-[16px] font-bold text-ink">Active Wallet Liabilities & Customer Balances</h3>
                <p className="text-[13px] text-[#68736d]">Users holding digital wallet balances. If a customer was already paid directly via bank, clear their balance below.</p>
              </div>
              <div className="text-left sm:text-right">
                <span className="block text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[2px]">Total Platform Liability</span>
                <strong className="text-[18px] text-red-600 font-manrope">{formatCurrency(ledger.walletLiabilities || 0)}</strong>
              </div>
            </div>
            
            <div className="p-[20px]">
              {(!ledger.usersWithBalance || ledger.usersWithBalance.length === 0) ? (
                <div className="text-center p-[40px] bg-[#f7f9f7] rounded-[16px]">
                  <div className="w-[48px] h-[48px] bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-[15px]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008b45" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <h3 className="font-manrope text-[16px] font-bold text-ink mb-[5px]">Zero Pending Wallet Liabilities</h3>
                  <p className="text-[13px] text-[#68736d]">All customer wallets are settled with ₦0 pending liabilities.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[850px]">
                    <thead>
                      <tr className="border-b border-black/5 text-[11px] text-[#7a847f] uppercase tracking-wider">
                        <th className="p-[10px_0] font-bold">Customer</th>
                        <th className="p-[10px] font-bold">Wallet Balance</th>
                        <th className="p-[10px] font-bold">Bank on File</th>
                        <th className="p-[10px] font-bold">Recent Credited Payouts</th>
                        <th className="p-[10px] font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {ledger.usersWithBalance.map((u: any) => (
                        <ClientWalletLiabilityRow key={u.id} user={u} formatCurrency={formatCurrency} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Due Payouts */}
          <div id="payouts-section" className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col">
            <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc] flex flex-col sm:flex-row justify-between sm:items-center gap-[12px]">
              <div>
                <h3 className="font-manrope text-[16px] font-bold text-ink">Customer Investment Payouts</h3>
                <p className="text-[13px] text-[#68736d]">Pay customer ROI and principal returns directly to their bank or credit their Getlands wallet.</p>
              </div>
              <div className="flex items-center gap-[8px] flex-wrap">
                {([
                  { id: 'ALL_PENDING', label: `All Pending (${ledger.allPendingPayouts?.length || 0})` },
                  { id: 'MONTH', label: `Due This Month (${ledger.upcomingPayouts?.length || 0})` },
                  { id: 'PAID', label: `Recently Paid (${ledger.recentPaidPayouts?.length || 0})` }
                ] as const).map(pill => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setPayoutFilter(pill.id)}
                    className={`px-[12px] py-[6px] rounded-full text-[11px] font-bold transition-colors ${
                      payoutFilter === pill.id
                        ? 'bg-[#008b45] text-white'
                        : 'bg-[#f4f7f5] text-[#68736d] hover:text-ink'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-[20px]">
              {displayedPayouts.length === 0 ? (
                <div className="text-center p-[40px] bg-[#f7f9f7] rounded-[16px]">
                  <div className="w-[48px] h-[48px] bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-[15px]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008b45" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <h3 className="font-manrope text-[16px] font-bold text-ink mb-[5px]">All Caught Up</h3>
                  <p className="text-[13px] text-[#68736d]">There are no payouts matching this filter.</p>
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
                        <th className="p-[10px] font-bold text-right">Action / Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {displayedPayouts.map((payout: any) => (
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
                        <th className="p-[10px_0] font-bold w-[110px]">Date</th>
                        <th className="p-[10px] font-bold">Customer</th>
                        <th className="p-[10px] font-bold">Bank Details</th>
                        <th className="p-[10px] font-bold">Requested</th>
                        <th className="p-[10px] font-bold">Fee</th>
                        <th className="p-[10px] font-bold">Net Wire</th>
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

      {/* Review Transfer Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl overflow-hidden">
            <div className="p-[20px] lg:p-[30px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
              <h2 className="font-manrope text-[20px] font-bold text-ink">Review Transfer</h2>
              <button 
                onClick={() => setSelectedTx(null)} 
                disabled={isProcessing !== null}
                className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center hover:bg-[#eef3ef] disabled:opacity-50"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-[30px] space-y-[20px]">
              <div className="space-y-[15px] bg-[#fcfdfc] p-[20px] rounded-[16px] border border-black/5">
                <div>
                  <span className="block text-[12px] text-[#7a847f] mb-[2px]">Customer</span>
                  <strong className="block text-[15px] text-ink">{selectedTx.user?.firstName || 'User'} {selectedTx.user?.lastName || ''}</strong>
                  <span className="block text-[12px] text-[#68736d]">{selectedTx.user?.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-[12px] text-[#7a847f] mb-[2px]">Type</span>
                  <strong className="block text-[15px] text-ink capitalize">{selectedTx.type}</strong>
                </div>
                <div>
                  <span className="block text-[12px] text-[#7a847f] mb-[2px]">Expected Amount</span>
                  <strong className="block text-[24px] font-manrope text-[#008b45]">{formatCurrency(selectedTx.amount)}</strong>
                </div>

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
                
                {selectedTx.type === 'withdrawal' && selectedTx.user?.bankAccounts?.[0] && (
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
                <button 
                  onClick={() => handleReject(selectedTx.id)} 
                  disabled={isProcessing !== null}
                  className="flex-1 py-[14px] bg-[#fdeeee] text-[#e53935] font-bold rounded-full disabled:opacity-50 hover:bg-[#fbdada] transition-colors"
                >
                  {isProcessing === selectedTx.id ? 'Processing...' : 'Reject'}
                </button>
                <button 
                  onClick={() => handleApprove(selectedTx.id)} 
                  disabled={isProcessing !== null}
                  className="flex-[2] py-[14px] bg-[#008b45] text-white font-bold rounded-full shadow-[0_8px_20px_rgba(0,139,69,0.25)] hover:bg-[#007339] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing === selectedTx.id ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                      Verifying & Crediting...
                    </>
                  ) : (
                    selectedTx.type === 'withdrawal' ? 'Mark as Transferred' : 'Approve & Verify'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
