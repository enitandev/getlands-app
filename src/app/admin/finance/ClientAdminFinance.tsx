"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { approveTransaction, rejectTransaction, bulkApproveTransactions, bulkRejectTransactions } from '@/app/actions/admin';
import { uploadTransactionReceiptAction } from '@/app/actions/checkout';
import { releaseDueCommissionsAction } from '@/app/actions/admin-ops';
import { notifyAllUsersWithWalletBalanceAction } from '@/app/actions/accounting';
import { formatCurrency } from '@/lib/mockData';
import { toast } from '@/components/ui/Toast';
import ClientPayoutRow from './ClientPayoutRow';
import ClientCommissionRow from './ClientCommissionRow';
import ClientWithdrawalRow from './ClientWithdrawalRow';
import ClientWalletLiabilityRow from './ClientWalletLiabilityRow';

type FinanceTab = 'pending' | 'withdrawals' | 'commissions' | 'ledger' | 'history';

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
    if (t === 'withdrawals' || t === 'commissions' || t === 'ledger' || t === 'history' || t === 'pending') return t;
    if (t === 'payouts') return 'ledger';
    return 'pending';
  };

  const [activeTab, setActiveTab] = useState<FinanceTab>(resolveTab(initialTab));
  const [txList, setTxList] = useState<any[]>(transactions);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [commissionFilter, setCommissionFilter] = useState<'PENDING' | 'PAID' | 'VOID' | 'ALL'>('PENDING');
  const [withdrawalFilter, setWithdrawalFilter] = useState<'PENDING' | 'PAID' | 'REJECTED' | 'ALL'>('PENDING');
  const [payoutFilter, setPayoutFilter] = useState<'MONTH' | 'ALL_PENDING' | 'PAID'>('ALL_PENDING');
  const [isReleasingComms, setIsReleasingComms] = useState(false);
  const [isNotifyingWalletUsers, setIsNotifyingWalletUsers] = useState(false);

  // Verification & Receipt states
  const [verifiedAmountInput, setVerifiedAmountInput] = useState<string>('');
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>('');
  const [adminReceiptFile, setAdminReceiptFile] = useState<File | null>(null);
  const [isAdminUploadingReceipt, setIsAdminUploadingReceipt] = useState<boolean>(false);
  const [receiptRefreshKey, setReceiptRefreshKey] = useState<number>(0);

  useEffect(() => {
    if (selectedTx) {
      setVerifiedAmountInput(selectedTx.amount !== undefined ? String(selectedTx.amount) : '0');
      setRejectionReasonInput('');
      setAdminReceiptFile(null);
    }
  }, [selectedTx]);

  const handleAdminUploadReceipt = async () => {
    if (!selectedTx || !adminReceiptFile) {
      toast('Please choose a receipt file to upload', 'error');
      return;
    }
    setIsAdminUploadingReceipt(true);
    try {
      const fd = new FormData();
      fd.append('reference', selectedTx.reference);
      fd.append('receipt', adminReceiptFile);
      const res = await uploadTransactionReceiptAction(fd);
      if (res?.error) {
        toast(res.error, 'error');
      } else {
        toast('Proof of payment attached to reference successfully!', 'success');
        setAdminReceiptFile(null);
        setReceiptRefreshKey(prev => prev + 1);
      }
    } catch (e: any) {
      toast(e.message || 'Failed to upload receipt', 'error');
    } finally {
      setIsAdminUploadingReceipt(false);
    }
  };

  const handleNotifyAllWalletHolders = async () => {
    const count = ledger?.usersWithBalance?.length || 0;
    if (count === 0) {
      toast('No users currently have a positive wallet balance.', 'info');
      return;
    }
    if (
      !confirm(
        `Send a personalized email and in-app notification to all ${count} user(s) who currently have money in their Getlands Wallet?\n\nEach user will see their exact wallet balance in Naira and instructions to log in, go to their Wallet, and submit a withdrawal request (processed in 24 to 48 hours).`
      )
    )
      return;

    setIsNotifyingWalletUsers(true);
    try {
      const res = await notifyAllUsersWithWalletBalanceAction();
      if (res?.error) {
        toast(res.error, 'error');
      } else {
        toast(`Sent personalized wallet withdrawal reminder emails to ${res.count} user(s)!`, 'success');
      }
    } catch (err: any) {
      toast(err.message || 'Failed to send wallet reminder emails', 'error');
    } finally {
      setIsNotifyingWalletUsers(false);
    }
  };

  useEffect(() => {
    setTxList(transactions);
  }, [transactions]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(resolveTab(initialTab));
    }
  }, [initialTab]);

  // Pending incoming deposit / investment transfers
  const pendingTxs = txList.filter(t => t.status === 'pending' && t.type !== 'withdrawal');
  const historyTxs = txList.filter(t => t.status !== 'pending');

  // Actual withdrawal requests from customer wallets
  const allWithdrawals: any[] = ledger?.allWithdrawals || txList.filter(t => t.type === 'withdrawal');
  const pendingWithdrawals: any[] = ledger?.pendingWithdrawals || allWithdrawals.filter(w => w.status === 'pending');
  const paidWithdrawals: any[] = ledger?.paidWithdrawals || allWithdrawals.filter(w => w.status === 'success');
  const rejectedWithdrawals: any[] = ledger?.rejectedWithdrawals || allWithdrawals.filter(w => w.status === 'failed');

  const filteredWithdrawals =
    withdrawalFilter === 'PENDING'
      ? pendingWithdrawals
      : withdrawalFilter === 'PAID'
        ? paidWithdrawals
        : withdrawalFilter === 'REJECTED'
          ? rejectedWithdrawals
          : allWithdrawals;

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

  const handleApprove = async (id: string, customAmount?: number) => {
    setIsProcessing(id);
    try {
      const res = await approveTransaction(id, customAmount);
      if (res?.error) {
        toast(res.error, 'error');
      } else {
        toast('Payment verified and holding activated!', 'success');
        setTxList(prev => prev.map(t => t.id === id ? { ...t, status: 'success', amount: customAmount || t.amount } : t));
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

  const handleReject = async (id: string, reason?: string) => {
    setIsProcessing(id);
    try {
      const res = await rejectTransaction(id, reason);
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
          <p className="text-[13px] lg:text-[14px] text-[#68736d]">Process customer withdrawal requests (24 to 48h SLA), verify bank transfers, pay agent commissions, and manage ROI payouts.</p>
        </div>
      </div>

      <div className="flex gap-[20px] lg:gap-[30px] border-b border-black/10 overflow-x-auto scrollbar-hide">
        <button onClick={() => setActiveTab('withdrawals')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'withdrawals' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
          Withdrawal Requests
          <span className={`ml-[8px] px-[6px] py-[2px] text-[10px] rounded-full ${pendingWithdrawals.length > 0 ? 'bg-red-600 text-white' : 'bg-[#eef3ef] text-[#008b45]'}`}>
            {pendingWithdrawals.length}
          </span>
          {activeTab === 'withdrawals' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
        </button>
        <button onClick={() => setActiveTab('pending')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'pending' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
          Deposit &amp; Transfer Verifications <span className="ml-[8px] px-[6px] py-[2px] bg-[#f5a623] text-white text-[10px] rounded-full">{pendingTxs.length}</span>
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
            Master Ledger &amp; Payouts
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

      {activeTab === 'withdrawals' && (
        <div className="space-y-[30px]">
          {/* Summary Cards distinguishing Actual Withdrawal Requests from Unrequested Wallet Balances */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            <div className="bg-white p-[24px] rounded-[24px] border-2 border-[#008b45]/25 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-[6px]">
                  <span className="text-[11px] text-[#008b45] font-bold uppercase tracking-[0.05em]">
                    Actual Withdrawal Requests (Pending)
                  </span>
                  <span className="px-[8px] py-[2px] rounded-full bg-[#eef3ef] text-[#008b45] text-[10px] font-bold">
                    24-48h SLA
                  </span>
                </div>
                <strong className="font-manrope text-[28px] font-extrabold text-ink leading-none block">
                  {formatCurrency(
                    ledger?.pendingWithdrawalsNet ??
                      pendingWithdrawals.reduce((s, w) => s + (w.netAmount ?? ((w.amount || 0) - (w.fee || 0))), 0)
                  )}
                </strong>
                <span className="text-[11px] text-[#68736d] font-bold block mt-[4px]">
                  Net Bank Wire Required (Gross Requested: {formatCurrency(
                    ledger?.pendingWithdrawalsGross ??
                      pendingWithdrawals.reduce((s, w) => s + (w.amount || 0), 0)
                  )})
                </span>
              </div>
              <p className="text-[12px] text-[#68736d] mt-[12px] pt-[10px] border-t border-black/5">
                <strong>{pendingWithdrawals.length}</strong> active withdrawal request{pendingWithdrawals.length === 1 ? '' : 's'} initiated by customers from their wallets.
              </p>
            </div>

            <div className="bg-white p-[24px] rounded-[24px] border border-black/5 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] block mb-[6px]">
                  Completed Bank Withdrawals
                </span>
                <strong className="font-manrope text-[28px] font-bold text-[#008b45] leading-none block">
                  {formatCurrency(
                    ledger?.paidWithdrawalsTotal ??
                      paidWithdrawals.reduce((s, w) => s + (w.amount || 0), 0)
                  )}
                </strong>
              </div>
              <p className="text-[12px] text-[#68736d] mt-[12px] pt-[10px] border-t border-black/5">
                <strong>{paidWithdrawals.length}</strong> withdrawal request{paidWithdrawals.length === 1 ? '' : 's'} wired to customer bank accounts.
              </p>
            </div>

            <div className="bg-[#182a20] text-white p-[24px] rounded-[24px] flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-[#a6baa9] font-bold uppercase tracking-[0.05em] block mb-[6px]">
                  Unrequested Wallet Balances (Passive)
                </span>
                <strong className="font-manrope text-[28px] font-bold text-[#a9e7bd] leading-none block mb-[8px]">
                  {formatCurrency(ledger?.walletLiabilities || 0)}
                </strong>
                <p className="text-[12px] text-white/80 leading-relaxed">
                  Funds currently sitting in customer wallets that have <strong>not</strong> been requested for withdrawal yet. Click below to email all users with a balance even if they have not logged in.
                </p>
              </div>
              {ledger && (
                <div className="mt-[14px] flex flex-wrap items-center gap-[10px]">
                  <button
                    type="button"
                    onClick={handleNotifyAllWalletHolders}
                    disabled={isNotifyingWalletUsers || (ledger?.usersWithBalance?.length || 0) === 0}
                    className="px-[14px] py-[8px] bg-[#008b45] hover:bg-[#007339] text-white text-[11px] font-bold rounded-full transition-colors disabled:opacity-50"
                  >
                    {isNotifyingWalletUsers
                      ? 'Sending Emails...'
                      : `Email All (${ledger?.usersWithBalance?.length || 0} Users) to Withdraw`}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('ledger');
                      setTimeout(() => {
                        document.getElementById('wallet-liabilities-section')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="text-[11px] font-bold text-[#a9e7bd] hover:underline"
                  >
                    View List &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Withdrawal Requests Table */}
          <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col">
            <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc] flex flex-col sm:flex-row justify-between sm:items-center gap-[12px]">
              <div>
                <h3 className="font-manrope text-[16px] font-bold text-ink">
                  Customer Wallet Withdrawal Requests
                </h3>
                <p className="text-[13px] text-[#68736d]">
                  Customers who have actively clicked Withdraw in their wallet to receive funds in their bank account. Process within 24 to 48 hours of request.
                </p>
              </div>
              <div className="flex items-center gap-[8px] flex-wrap">
                {([
                  { id: 'PENDING', label: `Pending Requests (${pendingWithdrawals.length})` },
                  { id: 'PAID', label: `Paid to Bank (${paidWithdrawals.length})` },
                  { id: 'REJECTED', label: `Rejected & Refunded (${rejectedWithdrawals.length})` },
                  { id: 'ALL', label: `All Requests (${allWithdrawals.length})` }
                ] as const).map(pill => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setWithdrawalFilter(pill.id)}
                    className={`px-[12px] py-[6px] rounded-full text-[11px] font-bold transition-colors ${
                      withdrawalFilter === pill.id
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
              {filteredWithdrawals.length === 0 ? (
                <div className="text-center p-[40px] bg-[#f7f9f7] rounded-[16px]">
                  <div className="w-[48px] h-[48px] bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-[15px]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008b45" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <h3 className="font-manrope text-[16px] font-bold text-ink mb-[5px]">
                    {withdrawalFilter === 'PENDING'
                      ? 'No Pending Withdrawal Requests'
                      : `No ${withdrawalFilter.toLowerCase()} withdrawal requests`}
                  </h3>
                  <p className="text-[13px] text-[#68736d] max-w-[460px] mx-auto">
                    {withdrawalFilter === 'PENDING'
                      ? 'No customers are currently waiting for a wallet withdrawal. When a customer requests a withdrawal from their wallet, it will appear here immediately.'
                      : 'Switch the filter pills above to view other withdrawal request records.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[850px]">
                    <thead>
                      <tr className="border-b border-black/5 text-[11px] text-[#7a847f] uppercase tracking-wider">
                        <th className="p-[10px_10px_10px_0] font-bold w-[170px]">Requested &amp; 24-48h SLA</th>
                        <th className="p-[10px] font-bold">Customer</th>
                        <th className="p-[10px] font-bold">Destination Bank</th>
                        <th className="p-[10px] font-bold">Requested</th>
                        <th className="p-[10px] font-bold">Fee</th>
                        <th className="p-[10px] font-bold">Net Bank Wire</th>
                        <th className="p-[10px_0_10px_10px] font-bold text-right">Action / Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {filteredWithdrawals.map((withdrawal: any) => (
                        <ClientWithdrawalRow
                          key={withdrawal.id}
                          withdrawal={withdrawal}
                          formatCurrency={formatCurrency}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingWithdrawals.length > 0 && (
            <div className="bg-white border-2 border-[#008b45]/30 rounded-[16px] p-[16px_20px] flex flex-col sm:flex-row sm:items-center justify-between gap-[12px] shadow-sm">
              <div className="flex items-center gap-[12px]">
                <span className="w-[36px] h-[36px] rounded-full bg-[#eef3ef] text-[#008b45] flex items-center justify-center font-bold text-[13px] shrink-0">
                  {pendingWithdrawals.length}
                </span>
                <div>
                  <strong className="block text-[14px] text-ink">
                    {pendingWithdrawals.length} Customer Withdrawal Request{pendingWithdrawals.length === 1 ? '' : 's'} Pending Bank Payout
                  </strong>
                  <span className="text-[12px] text-[#68736d]">
                    Customers have requested to withdraw {formatCurrency(ledger?.pendingWithdrawalsNet ?? pendingWithdrawals.reduce((s, w) => s + (w.netAmount ?? ((w.amount || 0) - (w.fee || 0))), 0))} to their bank accounts (24 to 48h SLA).
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('withdrawals')}
                className="px-[16px] py-[9px] bg-[#008b45] hover:bg-[#007339] text-white text-[12px] font-bold rounded-full transition-colors whitespace-nowrap w-fit"
              >
                Open Withdrawal Requests &rarr;
              </button>
            </div>
          )}

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
            <div className="hidden lg:grid grid-cols-[36px_1.4fr_1.6fr_1fr_125px_100px_165px] gap-[15px] p-[20px_24px] bg-[#fcfdfc] border-b border-black/5 text-[11px] font-bold text-[#7a847f] uppercase tracking-[0.05em] items-center">
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
              <div>Proof of Payment</div>
              <div>Date</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-black/5">
              {pendingTxs.map(tx => {
                const isSelected = selectedIds.includes(tx.id);
                const isItemProcessing = isProcessing === tx.id;
                return (
                  <div key={tx.id} className={`grid grid-cols-1 lg:grid-cols-[36px_1.4fr_1.6fr_1fr_125px_100px_165px] gap-[15px] p-[20px] lg:p-[20px_24px] items-start lg:items-center hover:bg-[#fcfdfc] transition-colors ${isSelected ? 'bg-[#008b45]/5' : ''}`}>
                    <div className="hidden lg:block">
                      <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => toggleSelectOne(tx.id)} 
                        className="w-4 h-4 rounded accent-[#008b45] cursor-pointer" 
                      />
                    </div>
                    <div>
                      <strong className="block text-[14px] text-ink leading-snug">{tx.user?.firstName || 'User'} {tx.user?.lastName || ''}</strong>
                      <span className="text-[12px] text-[#68736d] block truncate">{tx.user?.email || 'N/A'}</span>
                      {tx.user?.phoneNumber && (
                        <span className="text-[11px] text-[#7a847f] font-mono block mt-0.5">{tx.user.phoneNumber}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/5 text-ink">
                          {tx.type}
                        </span>
                        {tx.holding?.opportunity?.title && (
                          <span className="text-[10px] font-bold text-[#008b45] bg-[#008b45]/10 px-2 py-0.5 rounded-full truncate max-w-[150px]">
                            {tx.holding.opportunity.title}
                          </span>
                        )}
                      </div>
                      <span className="text-[12px] text-[#68736d] font-mono block truncate">{tx.reference}</span>
                    </div>
                    <div>
                      <strong className="text-[15px] text-[#008b45] font-bold font-manrope">{formatCurrency(tx.amount)}</strong>
                    </div>
                    <div>
                      <a 
                        href={`/api/receipt/${encodeURIComponent(tx.reference)}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#008b45]/10 text-[#008b45] hover:bg-[#008b45]/20 transition-colors"
                        title="View uploaded transfer receipt"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        View Slip ↗
                      </a>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-[20px]">
            {/* AUM */}
            <div className="bg-white p-[24px] rounded-[24px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center">
              <div className="w-[40px] h-[40px] rounded-full bg-[#008b45]/10 flex items-center justify-center text-[#008b45] mb-[15px]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <span className="text-[12px] text-[#7a847f] font-bold tracking-[0.03em] uppercase mb-[5px]">Assets Under Mgt.</span>
              <strong className="font-manrope text-[24px] font-bold text-ink leading-none">{formatCurrency(ledger.aum || 0)}</strong>
            </div>

            {/* Actual Withdrawal Requests - Clickable */}
            <button
              type="button"
              onClick={() => setActiveTab('withdrawals')}
              className="text-left bg-white p-[24px] rounded-[24px] border-2 border-[#008b45]/30 hover:border-[#008b45] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center relative overflow-hidden transition-all group"
            >
              <div className="w-[40px] h-[40px] rounded-full bg-[#008b45]/10 flex items-center justify-center text-[#008b45] mb-[15px]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              </div>
              <span className="text-[12px] text-[#008b45] font-bold tracking-[0.03em] uppercase mb-[5px]">Withdrawal Requests</span>
              <strong className="font-manrope text-[24px] font-bold text-ink leading-none">
                {formatCurrency(ledger.pendingWithdrawalsNet || 0)}
              </strong>
              <span className="text-[11px] font-bold text-[#008b45] group-hover:underline mt-[8px]">
                {pendingWithdrawals.length} request{pendingWithdrawals.length === 1 ? '' : 's'} to wire &rarr;
              </span>
            </button>

            {/* Unwithdrawn Wallet Balances - Clickable */}
            <button
              type="button"
              onClick={() => document.getElementById('wallet-liabilities-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-left bg-white p-[24px] rounded-[24px] border border-black/5 hover:border-red-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center relative overflow-hidden transition-all group"
            >
              <div className="w-[40px] h-[40px] rounded-full bg-red-500/10 flex items-center justify-center text-red-600 mb-[15px]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
              </div>
              <span className="text-[12px] text-[#7a847f] font-bold tracking-[0.03em] uppercase mb-[5px]">Unrequested Wallets</span>
              <strong className="font-manrope text-[24px] font-bold text-red-600 leading-none">{formatCurrency(ledger.walletLiabilities || 0)}</strong>
              <span className="text-[11px] font-bold text-red-600/80 group-hover:underline mt-[8px]">
                Passive balances &rarr;
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
              <span className="text-[12px] text-[#7a847f] font-bold tracking-[0.03em] uppercase mb-[5px]">Agent Escrow (Pending)</span>
              <strong className="font-manrope text-[24px] font-bold text-amber-600 leading-none">{formatCurrency(ledger.escrowLiabilities || 0)}</strong>
              <span className="text-[11px] font-bold text-amber-700 group-hover:underline mt-[8px]">
                Click to view &amp; pay ({pendingCommissions.length}) &rarr;
              </span>
            </button>

            {/* Capital Inflow */}
            <div className="bg-white p-[24px] rounded-[24px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center">
              <div className="w-[40px] h-[40px] rounded-full bg-[#008b45]/10 flex items-center justify-center text-[#008b45] mb-[15px]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"></path></svg>
              </div>
              <span className="text-[12px] text-[#7a847f] font-bold tracking-[0.03em] uppercase mb-[5px]">Total Inflow</span>
              <strong className="font-manrope text-[24px] font-bold text-ink leading-none">{formatCurrency(ledger.totalIncoming || 0)}</strong>
            </div>

            {/* Capital Outflow */}
            <div className="bg-white p-[24px] rounded-[24px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center">
              <div className="w-[40px] h-[40px] rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 mb-[15px]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7"></path></svg>
              </div>
              <span className="text-[12px] text-[#7a847f] font-bold tracking-[0.03em] uppercase mb-[5px]">Total Outflow</span>
              <strong className="font-manrope text-[24px] font-bold text-ink leading-none">{formatCurrency(ledger.totalOutgoing || 0)}</strong>
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
            <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc] flex flex-col lg:flex-row justify-between lg:items-center gap-[12px]">
              <div>
                <h3 className="font-manrope text-[16px] font-bold text-ink">Active Wallet Liabilities &amp; Customer Balances</h3>
                <p className="text-[13px] text-[#68736d]">Users holding digital wallet balances. Email them to log in and request a withdrawal, or clear balances already paid offline.</p>
              </div>
              <div className="flex flex-wrap items-center gap-[15px]">
                {(ledger.usersWithBalance?.length || 0) > 0 && (
                  <button
                    type="button"
                    onClick={handleNotifyAllWalletHolders}
                    disabled={isNotifyingWalletUsers}
                    className="px-[16px] py-[9px] bg-[#008b45] hover:bg-[#007339] text-white text-[12px] font-bold rounded-full transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isNotifyingWalletUsers
                      ? 'Sending Emails...'
                      : `Email All (${ledger.usersWithBalance.length}) Users to Withdraw`}
                  </button>
                )}
                <div className="text-left lg:text-right">
                  <span className="block text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[2px]">Total Platform Liability</span>
                  <strong className="text-[18px] text-red-600 font-manrope">{formatCurrency(ledger.walletLiabilities || 0)}</strong>
                </div>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-[16px] lg:p-[24px] animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-[24px] w-full max-w-[760px] max-h-[92vh] shadow-2xl flex flex-col overflow-hidden my-auto">
            {/* Header */}
            <div className="p-[20px] lg:p-[24px_30px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
              <div>
                <h2 className="font-manrope text-[18px] lg:text-[20px] font-bold text-ink leading-tight">
                  Verify Transfer &amp; Proof of Payment
                </h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="font-mono text-[12px] text-[#68736d] bg-black/5 px-2 py-0.5 rounded">
                    Ref: {selectedTx.reference}
                  </span>
                  <span className="text-[12px] text-[#7a847f]">
                    Submitted {new Date(selectedTx.date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTx(null)} 
                disabled={isProcessing !== null || isAdminUploadingReceipt}
                className="w-[34px] h-[34px] bg-[#f7f9f7] rounded-full flex items-center justify-center hover:bg-[#eef3ef] disabled:opacity-50 transition-colors text-[#68736d] hover:text-ink"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-[20px] lg:p-[24px_30px] space-y-[20px] overflow-y-auto max-h-[calc(92vh-170px)]">
              {/* Context Grid: Customer Info & Asset Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
                {/* Customer Details */}
                <div className="bg-[#fcfdfc] p-[16px] rounded-[16px] border border-black/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#7a847f] uppercase tracking-wider block mb-1">Customer</span>
                    <strong className="block text-[15px] text-ink font-manrope">
                      {selectedTx.user?.firstName || 'User'} {selectedTx.user?.lastName || ''}
                    </strong>
                    <span className="text-[12px] text-[#68736d] block break-all">{selectedTx.user?.email || 'N/A'}</span>
                    {selectedTx.user?.phoneNumber && (
                      <span className="text-[12px] text-ink font-mono block mt-1">{selectedTx.user.phoneNumber}</span>
                    )}
                  </div>
                  {selectedTx.user?.phoneNumber && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-black/5">
                      <a 
                        href={`https://wa.me/${selectedTx.user.phoneNumber.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#25d366]/10 text-[#075e54] text-[11px] font-bold rounded-full hover:bg-[#25d366]/20 transition-colors"
                      >
                        WhatsApp Client ↗
                      </a>
                      <a 
                        href={`tel:${selectedTx.user.phoneNumber}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/5 text-ink text-[11px] font-bold rounded-full hover:bg-black/10 transition-colors"
                      >
                        Call ↗
                      </a>
                    </div>
                  )}
                </div>

                {/* Deal / Transaction Purpose */}
                <div className="bg-[#fcfdfc] p-[16px] rounded-[16px] border border-black/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#7a847f] uppercase tracking-wider block mb-1">
                      {selectedTx.type === 'deposit' ? 'Transaction Type' : 'Linked Investment'}
                    </span>
                    {selectedTx.holding?.opportunity ? (
                      <div>
                        <strong className="block text-[15px] text-ink font-manrope leading-tight">
                          {selectedTx.holding.opportunity.title}
                        </strong>
                        <span className="inline-block mt-1 text-[11px] font-bold text-[#008b45] bg-[#008b45]/10 px-2 py-0.5 rounded-full capitalize">
                          {selectedTx.holding.opportunity.category?.replace('_', ' ')}
                        </span>
                        <div className="mt-2 text-[12px] text-[#68736d] space-y-0.5">
                          <p>Allocation: <strong className="text-ink">{selectedTx.holding.units || 1} unit(s)</strong></p>
                          {selectedTx.holding.expectedReturn && (
                            <p>Target ROI: <strong className="text-ink">{selectedTx.holding.expectedReturn}</strong></p>
                          )}
                        </div>
                      </div>
                    ) : selectedTx.type === 'deposit' ? (
                      <div>
                        <strong className="block text-[15px] text-ink font-manrope">Wallet Top-up</strong>
                        <p className="text-[12px] text-[#68736d] mt-1">
                          Direct bank transfer deposit. Approving will credit customer available balance immediately.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <strong className="block text-[15px] text-ink font-manrope capitalize">{selectedTx.type}</strong>
                        <p className="text-[12px] text-[#68736d] mt-1">
                          Standard transaction allocation.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-black/5 flex items-center justify-between">
                    <span className="text-[11px] text-[#7a847f] font-bold uppercase">Stated by Customer</span>
                    <strong className="text-[15px] font-bold text-ink font-manrope">{formatCurrency(selectedTx.amount)}</strong>
                  </div>
                </div>
              </div>

              {/* Bank Details for Withdrawal if applicable */}
              {selectedTx.type === 'withdrawal' && selectedTx.user?.bankAccounts?.[0] && (
                <div className="bg-[#eef3ef]/60 p-[16px] rounded-[16px] border border-[#008b45]/20 space-y-[6px]">
                  <span className="block text-[11px] text-[#008b45] mb-[4px] uppercase tracking-wider font-bold">
                    Payout Destination (Bank on File)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[13px]">
                    <div>
                      <span className="text-[#68736d] block text-[11px]">Bank</span>
                      <strong className="text-ink">{selectedTx.user.bankAccounts[0].bankName}</strong>
                    </div>
                    <div>
                      <span className="text-[#68736d] block text-[11px]">Account Name</span>
                      <strong className="text-ink">{selectedTx.user.bankAccounts[0].accountName}</strong>
                    </div>
                    <div>
                      <span className="text-[#68736d] block text-[11px]">Account Number</span>
                      <strong className="font-mono text-ink text-[14px]">{selectedTx.user.bankAccounts[0].accountNumber}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Proof of Payment Viewer & Offline Attachment */}
              <div className="bg-[#fcfdfc] p-[16px] lg:p-[20px] rounded-[18px] border border-black/5 space-y-[14px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#008b45" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      Proof of Payment / Transfer Slip
                    </span>
                  </div>
                  <a 
                    href={`/api/receipt/${encodeURIComponent(selectedTx.reference)}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1 text-[12px] text-[#008b45] font-bold hover:underline"
                  >
                    Open Full Slip ↗
                  </a>
                </div>

                {/* Live Embedded Preview Frame */}
                <div className="relative w-full h-[260px] bg-white rounded-[14px] overflow-hidden border border-black/10 shadow-inner">
                  <iframe 
                    key={`receipt-frame-${selectedTx.reference}-${receiptRefreshKey}`}
                    src={`/api/receipt/${encodeURIComponent(selectedTx.reference)}?t=${receiptRefreshKey}`} 
                    className="w-full h-full border-0" 
                    title="Transfer Slip Preview" 
                  />
                </div>

                {/* Offline Receipt Attachment (Admin override) */}
                <div className="p-[12px] bg-white rounded-[14px] border border-dashed border-black/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <span className="block text-[12px] font-bold text-ink">
                      Attach or Replace Proof (Admin Override)
                    </span>
                    <p className="text-[11px] text-[#68736d]">
                      Received slip via WhatsApp or email? Upload here to store on Supabase Storage.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className="cursor-pointer px-3 py-1.5 bg-[#f4f7f5] hover:bg-black/5 text-ink text-[11px] font-bold rounded-lg border border-black/10 transition-colors whitespace-nowrap">
                      {adminReceiptFile ? adminReceiptFile.name.substring(0, 18) + '...' : 'Choose File'}
                      <input 
                        type="file" 
                        accept="image/*,application/pdf" 
                        className="hidden" 
                        onChange={e => {
                          const f = e.target.files?.[0];
                          if (f) setAdminReceiptFile(f);
                        }} 
                      />
                    </label>
                    {adminReceiptFile && (
                      <button 
                        type="button"
                        onClick={handleAdminUploadReceipt}
                        disabled={isAdminUploadingReceipt}
                        className="px-3 py-1.5 bg-[#008b45] text-white text-[11px] font-bold rounded-lg hover:bg-[#007339] disabled:opacity-50 transition-colors whitespace-nowrap"
                      >
                        {isAdminUploadingReceipt ? 'Uploading...' : 'Save Slip'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Verification & Amount Override */}
              <div className="bg-[#fcfdfc] p-[16px] lg:p-[20px] rounded-[18px] border border-black/5 space-y-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-ink uppercase tracking-wider">
                    Verified Amount Received
                  </span>
                  {verifiedAmountInput !== String(selectedTx.amount) && (
                    <button 
                      type="button" 
                      onClick={() => setVerifiedAmountInput(String(selectedTx.amount))}
                      className="text-[11px] text-[#008b45] font-bold hover:underline"
                    >
                      Reset to Stated ({formatCurrency(selectedTx.amount)})
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#68736d] text-[14px]">₦</span>
                    <input 
                      type="number"
                      step="any"
                      value={verifiedAmountInput}
                      onChange={e => setVerifiedAmountInput(e.target.value)}
                      placeholder="Verified Amount"
                      className="w-full pl-8 pr-4 py-2.5 bg-white border border-black/15 rounded-[12px] text-[15px] font-manrope font-bold text-ink focus:outline-none focus:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/10"
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#7a847f] block">Preview Credit</span>
                    <strong className="text-[15px] font-manrope font-bold text-[#008b45]">
                      {formatCurrency(parseFloat(verifiedAmountInput) || 0)}
                    </strong>
                  </div>
                </div>
                <p className="text-[11px] text-[#68736d] leading-normal">
                  If the bank alert reflects a different figure, edit the sum above. The customer&apos;s holding or wallet balance will be activated with this verified amount.
                </p>

                {/* Optional Rejection Reason */}
                <div className="pt-2 border-t border-black/5">
                  <label className="block text-[11px] font-bold text-[#7a847f] uppercase tracking-wider mb-1">
                    Rejection Reason (Optional, sent to customer if rejected)
                  </label>
                  <input 
                    type="text" 
                    value={rejectionReasonInput}
                    onChange={e => setRejectionReasonInput(e.target.value)}
                    placeholder="e.g. Reference code not found on bank statement, payment unconfirmed, please contact support"
                    className="w-full px-3.5 py-2 bg-white border border-black/15 rounded-[10px] text-[12px] text-ink focus:outline-none focus:border-red-500 placeholder:text-black/30"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-[16px_20px] lg:p-[18px_30px] border-t border-black/5 bg-[#fcfdfc] flex items-center justify-between gap-3">
              <button 
                type="button"
                onClick={() => setSelectedTx(null)} 
                disabled={isProcessing !== null || isAdminUploadingReceipt}
                className="px-4 py-2.5 bg-[#f4f7f5] hover:bg-black/5 text-ink text-[12px] font-bold rounded-full transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={() => handleReject(selectedTx.id, rejectionReasonInput)} 
                  disabled={isProcessing !== null || isAdminUploadingReceipt}
                  className="px-5 py-2.5 bg-[#fdeeee] text-[#e53935] hover:bg-[#fbdada] text-[12px] font-bold rounded-full disabled:opacity-50 transition-colors"
                >
                  {isProcessing === selectedTx.id ? 'Processing...' : 'Reject Transfer'}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    const finalNum = parseFloat(verifiedAmountInput);
                    handleApprove(selectedTx.id, !isNaN(finalNum) && finalNum > 0 ? finalNum : undefined);
                  }} 
                  disabled={isProcessing !== null || isAdminUploadingReceipt}
                  className="px-6 py-2.5 bg-[#008b45] hover:bg-[#007339] text-white text-[12px] font-bold rounded-full shadow-[0_4px_14px_rgba(0,139,69,0.25)] disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isProcessing === selectedTx.id ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                      Verifying &amp; Crediting...
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      {selectedTx.type === 'withdrawal'
                        ? 'Mark as Transferred'
                        : `Approve & Verify (${formatCurrency(parseFloat(verifiedAmountInput) || selectedTx.amount)})`}
                    </>
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
